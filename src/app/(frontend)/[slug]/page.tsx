import { PageRenderer } from '@/components/page/PageRenderer';
import { buildPageMetadata } from '@/lib/buildPageMetadata';
import { getAllPageSlugs, getPageBySlug } from '@/lib/getPageBySlug';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageParams {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return { title: 'Page not found' };
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page not found',
    };
  }

  return buildPageMetadata(page);
}

export default async function PageRoute({ params }: PageParams) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <PageRenderer sections={page.sections} layout={page.layout ?? 'standard'} />;
}
