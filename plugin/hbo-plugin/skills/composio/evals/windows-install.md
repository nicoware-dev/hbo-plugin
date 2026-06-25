# Eval: Windows install path

User: "Set up Composio on Windows for HBO."

## Success

- [ ] Recommends WSL + `setup-composio-windows.ps1`, not curl installer on PS
- [ ] Does not suggest `npm install -g @composio/cli`
- [ ] Mentions HBO two-step approve → execute

## Fail

- Runs `curl -fsSL https://composio.dev/install | bash` in PowerShell
- Skips HBO approval before external execute
