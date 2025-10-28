import type { Page } from '@/payload-types';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { FC } from 'react';
import type { PageLayout } from './index';

type RichTextSection = Extract<
  NonNullable<Page['sections']>[number],
  { blockType: 'richText' }
>;

export interface RichTextBlockProps {
  block: RichTextSection;
  index: number;
  layout: PageLayout;
}

export const RichTextBlock: FC<RichTextBlockProps> = ({ block, layout: _layout }) => {
  if (!block.content) return null;

  return (
    <section className="container py-12 md:py-16">
      <RichText data={block.content} />
    </section>
  );
};
