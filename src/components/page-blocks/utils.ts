type MaybeMedia =
  | null
  | undefined
  | string
  | {
      url?: string | null;
      alt?: string | null;
      width?: number | null;
      height?: number | null;
    };

export const resolveMedia = (value: MaybeMedia) => {
  if (value && typeof value === "object" && "url" in value && value.url) {
    return {
      url: value.url,
      alt: value.alt || "",
      width: value.width ?? undefined,
      height: value.height ?? undefined,
    };
  }
  return null;
};

export const stringOr = (value: string | null | undefined, fallback: string) =>
  value && value.trim().length ? value.trim() : fallback;
