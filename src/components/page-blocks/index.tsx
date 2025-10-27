import type { Page } from '@/payload-types';
import type { ComponentType } from 'react';
import { RichTextBlock } from './RichTextBlock';

type PageBlock = NonNullable<Page['sections']>[number];

export type BlockRendererMap = {
  [K in PageBlock['blockType']]: ComponentType<{
    block: Extract<PageBlock, { blockType: K }>;
    index: number;
  }>;
};

export const blockComponents: BlockRendererMap = {
  richText: RichTextBlock,
};
