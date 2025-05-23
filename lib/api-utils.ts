export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function handleAPIResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      error.message || "An error occurred while fetching data",
      response.status,
      error.code
    );
  }
  return response.json();
}

export function createQueryKey(
  base: string,
  params?: Record<string, any>
): string[] {
  if (!params) return [base];
  return [base, ...Object.entries(params).flat()];
}
