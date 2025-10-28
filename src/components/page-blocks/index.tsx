import type { Page } from '@/payload-types';
import type { ComponentType } from 'react';
import { FeatureCarouselBlock } from './FeatureCarouselBlock';
import { HeroBlock } from './HeroBlock';
import { MediaTextBlock } from './MediaTextBlock';
import { PartnerShowcaseBlock } from './PartnerShowcaseBlock';
import { ProductHighlightsBlock } from './ProductHighlightsBlock';
import { RichTextBlock } from './RichTextBlock';
import { TeamShowcaseBlock } from './TeamShowcaseBlock';

type PageBlock = NonNullable<Page['sections']>[number];

export type PageLayout = 'standard' | 'alternating';

export type BlockRendererMap = {
  [K in PageBlock['blockType']]: ComponentType<{
    block: Extract<PageBlock, { blockType: K }>;
    index: number;
    layout: PageLayout;
  }>;
};

export const blockComponents: BlockRendererMap = {
  hero: HeroBlock,
  featureCarousel: FeatureCarouselBlock,
  mediaText: MediaTextBlock,
  partnerShowcase: PartnerShowcaseBlock,
  productHighlights: ProductHighlightsBlock,
  teamShowcase: TeamShowcaseBlock,
  richText: RichTextBlock,
};
