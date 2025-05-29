export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res = await fetch(`${baseUrl}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`Error en fetch: ${res.statusText}`);
  }
  return res.json();
};