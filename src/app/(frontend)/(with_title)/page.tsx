import type { Metadata } from 'next';
import configPromise from '@/payload.config';
import HomePageClient from './page.client';
import { getPayload } from 'payload';

export const metadata: Metadata = {
  title: 'Digital Assets Marketplace',
  description:
    'Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.',
  openGraph: {
    title: 'Digital Assets Marketplace',
    description:
      'Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.',
  },
  twitter: {
    title: 'Digital Assets Marketplace',
    description:
      'Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.',
  },
};

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise });

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    limit: 1,
    depth: 3,
  });

  const homePage = pages.docs[0] ?? null;

  return (
    <HomePageClient sections={homePage?.sections ?? null} />
  );
}
