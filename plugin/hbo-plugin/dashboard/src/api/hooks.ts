import { API_BASE, getSDK } from "./client";

export function useApiHealth(): {
  loading: boolean;
  apiMounted: boolean;
  error: string | null;
} {
  const { useState, useEffect } = getSDK().hooks;
  const [loading, setLoading] = useState(true);
  const [apiMounted, setApiMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSDK()
      .fetchJSON(`${API_BASE}/health`)
      .then(() => {
        if (!cancelled) setApiMounted(true);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setApiMounted(false);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, apiMounted, error };
}

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

async function requestJSON(path: string, method: string, body?: unknown): Promise<unknown> {
  const options: RequestInit = { method };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }
  return getSDK().fetchJSON(`${API_BASE}${path}`, options);
}

export async function postAction(path: string): Promise<unknown> {
  return requestJSON(path, "POST");
}

export async function postJSON(path: string, body: unknown): Promise<unknown> {
  return requestJSON(path, "POST", body);
}

export async function putJSON(path: string, body: unknown): Promise<unknown> {
  return requestJSON(path, "PUT", body);
}

export async function deleteJSON(path: string): Promise<unknown> {
  return requestJSON(path, "DELETE");
}
