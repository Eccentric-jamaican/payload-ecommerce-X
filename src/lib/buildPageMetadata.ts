import type { Media, Page } from '@/payload-types';
import type { Metadata } from 'next';

const resolveMediaUrl = (media?: string | Media | null): string | undefined => {
  if (!media) return undefined;
  if (typeof media === 'string') return media;
  return media.url ?? undefined;
};

export function buildPageMetadata(page: Page): Metadata {
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  const imageUrl = resolveMediaUrl(page.ogImage);

  const metadata: Metadata = {
    title,
    description,
  };

  if (imageUrl) {
    metadata.openGraph = {
      title,
      description,
      images: [{ url: imageUrl }],
    };

    metadata.twitter = {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    };
  } else {
    metadata.openGraph = {
      title,
      description,
    };

    metadata.twitter = {
      title,
      description,
    };
  }

  return metadata;
}
