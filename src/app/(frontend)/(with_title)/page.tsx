import type { Metadata } from 'next';
import configPromise from '@/payload.config';
import HomePageClient from './page.client';
import { getPayload } from 'payload';

export const metadata: Metadata = {
  title: 'Alphamed Global Limited',
  description:
    'Integrated procurement and distribution for government and private healthcare networks across Africa.',
  openGraph: {
    title: 'Alphamed Global Limited',
    description:
      'Integrated procurement and distribution for government and private healthcare networks across Africa.',
  },
  twitter: {
    title: 'Alphamed Global Limited',
    description:
      'Integrated procurement and distribution for government and private healthcare networks across Africa.',
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

  return <HomePageClient sections={homePage?.sections ?? null} />;
}
