import { API_BASE, getSDK } from "./client";

export function useFetch<T>(path: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const { useState, useEffect } = getSDK().hooks;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

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
  }, [path, tick]);

  return { data, loading, error, refetch };
}

export async function postAction(path: string): Promise<unknown> {
  return getSDK().fetchJSON(`${API_BASE}${path}`, { method: "POST" });
}
