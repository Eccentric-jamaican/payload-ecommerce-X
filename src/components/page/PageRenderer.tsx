import type { Page } from '@/payload-types';
import { blockComponents, type PageLayout } from '@/components/page-blocks';
import type { ComponentType } from 'react';

type PageBlock = NonNullable<Page['sections']>[number];

interface PageRendererProps {
  sections?: Page['sections'];
  layout?: PageLayout | null;
}

export function PageRenderer({ sections, layout = 'standard' }: PageRendererProps) {
  if (!sections?.length) {
    return null;
  }

  const resolvedLayout: PageLayout =
    layout === 'alternating' || layout === 'standard' ? layout : 'standard';

  return (
    <>
      {sections.map((block, index) => {
        const blockType = block.blockType as PageBlock['blockType'];
        const Component = blockComponents[blockType] as ComponentType<{
          block: PageBlock;
          index: number;
          layout: PageLayout;
        }>;

        if (!Component) {
          console.warn(`No renderer found for block type "${block.blockType}"`);
          return null;
        }

        return (
          <Component
            key={block.id ?? `${block.blockType}-${index}`}
            block={block as PageBlock}
            index={index}
            layout={resolvedLayout}
          />
        );
      })}
    </>
  );
}

