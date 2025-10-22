export async function fetchApi<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}