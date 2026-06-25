"""Google Sheets → HBO Plugin lead importer.

Reads rows from a Google Sheet via Composio CLI and maps them to HBO lead shape.
Supports Windows (WSL), macOS, and Linux via composio_client wrapper.
"""

from __future__ import annotations

from typing import Any

from .. import state
from .composio_client import is_available, platform, run_argv


def search_spreadsheets(query: str) -> list[dict[str, Any]]:
    """Search for spreadsheets by title."""
    data = run_argv(["search", query])
    return data.get("results", [])


def get_sheet_names(spreadsheet_id: str) -> list[str]:
    """Get tab names from a spreadsheet."""
    data = run_argv(
        ["execute", "GOOGLESHEETS_GET_SHEET_NAMES"],
        {"spreadsheet_id": spreadsheet_id},
    )
    sheets = data.get("data", {}).get("sheets", [])
    return [s["properties"]["title"] for s in sheets]


def read_rows(spreadsheet_id: str, sheet: str, range_str: str) -> list[list[str]]:
    """Read rows from a sheet range."""
    data = run_argv(
        ["execute", "GOOGLESHEETS_VALUES_GET"],
        {"spreadsheet_id": spreadsheet_id, "range": f"{sheet}!{range_str}"},
    )
    return data.get("data", {}).get("values", [])


def import_leads(
    spreadsheet_id: str,
    sheet: str = "Hoja 1",
    has_header: bool = True,
    max_rows: int = 100,
) -> dict[str, Any]:
    """Import leads from a Google Sheet into HBO state.

    Expected columns (by index):
        0: name, 1: email, 2: company, 3: phone, 4: source,
        5: segment, 6: score, 7: priority, 8: status,
        9: ownerAgentId, 10: recommendedAction
    """
    rows = read_rows(spreadsheet_id, sheet, f"A1:K{max_rows + 1}")
    if not rows:
        return {"success": False, "error": "No data found in sheet"}

    start = 1 if has_header else 0
    imported: list[dict[str, Any]] = []
    errors: list[str] = []

    for i, row in enumerate(rows[start:], start=start + 1):
        if not row or not row[0]:
            continue  # skip empty rows

        try:
            lead = {
                "id": f"lead_sheet_{len(state.list_leads()) + len(imported) + 1:03d}",
                "name": _clean(row, 0),
                "email": _clean(row, 1),
                "company": _clean(row, 2),
                "phone": _clean_phone(row, 3),
                "source": _clean(row, 4, "sheets_import"),
                "segment": _clean(row, 5, "commerce"),
                "score": int(_clean(row, 6, "50")),
                "priority": _clean(row, 7, "medium"),
                "status": _clean(row, 8, "new"),
                "ownerAgentId": _clean(row, 9, "sales-ops-agent"),
                "recommendedAction": _clean(row, 10, "Review imported lead"),
            }
            state.append_lead(lead)
            imported.append(lead)
        except Exception as e:
            errors.append(f"Row {i}: {e}")

    return {
        "success": True,
        "imported": len(imported),
        "errors": errors,
        "total_leads": len(state.list_leads()),
    }


def _clean_phone(row: list[str], index: int, default: str = "") -> str:
    """Preserve international phone numbers; Sheets often breaks + formulas."""
    if index >= len(row):
        return default
    raw = str(row[index]).strip()
    if raw.startswith("'"):
        raw = raw[1:].strip()
    if raw.startswith("#") or not raw:
        return default
    digits_plus = "".join(c for c in raw if c.isdigit() or c == "+")
    if not digits_plus:
        return default
    if digits_plus.startswith("+"):
        return digits_plus
    if len(digits_plus) >= 8:
        return f"+{digits_plus}"
    return digits_plus


def _clean(row: list[str], index: int, default: str = "") -> str:
    """Safely get a cell value, strip it, return default if empty."""
    if index >= len(row):
        return default
    value = str(row[index]).strip()
    # Remove leading ' that Sheets adds to escape formulas
    if value.startswith("'"):
        value = value[1:]
    # Clear Sheets formula errors (e.g. #ERROR!, #N/A, #REF!)
    if value.startswith("#"):
        return default
    return value or default
