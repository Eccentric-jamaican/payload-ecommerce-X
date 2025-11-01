import configPromise from '@/payload.config';
import type { Page } from '@/payload-types';
import { getPayload } from 'payload';
import { cache } from 'react';

interface GetPageBySlugOptions {
  draft?: boolean;
}

export const getPageBySlug = cache(
  async (slug: string, options: GetPageBySlugOptions = {}): Promise<Page | null> => {
    const { draft = false } = options;

    const payload = await getPayload({
      config: configPromise,
    });

    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 3,
      draft,
    });

    return result.docs[0] ?? null;
  },
);

export const getAllPageSlugs = cache(async (): Promise<string[]> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const result = await payload.find({
    collection: 'pages',
    where: {
      status: {
        equals: 'published',
      },
    },
    limit: 100,
    depth: 0,
    draft: false,
    select: {
      slug: true,
    },
  });

  const slugs = result.docs.map((doc) => doc.slug);
  const reserved = new Set(["blog", "products", "admin", "api"]);
  return slugs.filter((s) => !reserved.has(s));
});
