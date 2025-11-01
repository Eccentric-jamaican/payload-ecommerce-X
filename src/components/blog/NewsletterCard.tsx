import Link from "next/link";

interface NewsletterCardProps {
  title?: string | null;
  description?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export const NewsletterCard = ({
  title,
  description,
  ctaLabel,
  ctaUrl,
}: NewsletterCardProps) => {
  const hasCta =
    typeof ctaLabel === "string" &&
    ctaLabel.length > 0 &&
    typeof ctaUrl === "string" &&
    ctaUrl.length > 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl bg-[#0A233D] p-10 text-white shadow-[0px_24px_48px_rgba(4,16,36,0.35)]">
      <div className="space-y-5">
        <h3 className="text-3xl font-semibold tracking-tight">
          {title ?? "Never miss a story"}
        </h3>
        <p className="text-base leading-7 text-white/70">
          {description ?? "Stay updated with Alphamed Global news as it happens."}
        </p>
      </div>
      {hasCta ? (
        <Link
          href={ctaUrl!}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B0B0F] transition hover:bg-white/90"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default NewsletterCard;
