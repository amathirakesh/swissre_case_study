import { useUiStore } from '../store/ui-store';

export async function http<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const activeDemoRole = useUiStore.getState().activeDemoRole;
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      'X-Demo-Role': activeDemoRole,
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
