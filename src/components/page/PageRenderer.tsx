import type { Page } from '@/payload-types';
import { blockComponents } from '@/components/page-blocks';

type PageBlock = NonNullable<Page['sections']>[number];

interface PageRendererProps {
  sections?: Page['sections'];
}

export function PageRenderer({ sections }: PageRendererProps) {
  if (!sections?.length) {
    return null;
  }

  return (
    <>
      {sections.map((block, index) => {
        const Component = blockComponents[block.blockType as PageBlock['blockType']];

        if (!Component) {
          console.warn(`No renderer found for block type "${block.blockType}"`);
          return null;
        }

        return (
          <Component
            key={block.id ?? `${block.blockType}-${index}`}
            block={block as Extract<PageBlock, { blockType: typeof block.blockType }>}
            index={index}
          />
        );
      })}
    </>
  );
}
