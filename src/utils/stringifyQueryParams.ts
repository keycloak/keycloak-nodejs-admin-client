export function stringifyQueryParams(params: Record<string, unknown>) {
  return new URLSearchParams(
    Object.entries(params)
      .filter((param): param is [string, string] => {
        const [, value] = param;

        if (Array.isArray(value) && value.length === 0) {
          return false;
        }

        return !!value;
      })
  ).toString();
}