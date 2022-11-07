export function stringifyQueryParams(params: Record<string, string | undefined>) {
  return new URLSearchParams(
    Object.entries(params)
      .filter((param): param is [string, string] => !!param[1])
  ).toString();
}