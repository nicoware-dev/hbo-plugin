import { API_BASE, getSDK } from "./client";

export function useFetch<T>(path: string): { data: T | null; loading: boolean; error: string | null } {
  const { useState, useEffect } = getSDK().hooks;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSDK()
      .fetchJSON(`${API_BASE}${path}`)
      .then((result) => {
        if (!cancelled) setData(result as T);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, loading, error };
}

export async function postAction(path: string): Promise<unknown> {
  return getSDK().fetchJSON(`${API_BASE}${path}`, { method: "POST" });
}
