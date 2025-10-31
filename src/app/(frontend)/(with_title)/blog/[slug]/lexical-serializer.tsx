import React from 'react';

interface LexicalNode {
  type: string;
  version?: number;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  style?: string;
  indent?: number;
  direction?: string;
  tag?: string;
  url?: string;
  rel?: string;
  target?: string;
  relationTo?: string;
  value?: unknown;
  fields?: Record<string, unknown>;
}

interface LexicalContent {
  root: {
    children: LexicalNode[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

const formatText = (text: string, format?: number): React.ReactNode => {
  if (!format) return text;
  
  let formattedText: React.ReactNode = text;
  
  // Bold
  if (format & 1) {
    formattedText = <strong>{formattedText}</strong>;
  }
  
  // Italic
  if (format & 2) {
    formattedText = <em>{formattedText}</em>;
  }
  
  // Strikethrough
  if (format & 4) {
    formattedText = <s>{formattedText}</s>;
  }
  
  // Underline
  if (format & 8) {
    formattedText = <u>{formattedText}</u>;
  }
  
  // Code
  if (format & 16) {
    formattedText = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{formattedText}</code>;
  }
  
  return formattedText;
};

const serializeNode = (node: LexicalNode, index: number): React.ReactNode => {
  switch (node.type) {
    case 'text':
      return formatText(node.text || '', node.format);
      
    case 'paragraph':
      return (
        <p key={index} className="mb-6 text-lg leading-8 text-[#2F3140]">
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </p>
      );
      
    case 'heading': {
      type HeadingTagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingClasses: Record<HeadingTagName, string> = {
        h1: 'text-4xl md:text-5xl font-semibold tracking-tight text-[#0B0B0F] leading-tight mt-16 mb-8 first:mt-0',
        h2: 'text-3xl md:text-4xl font-semibold tracking-tight text-[#0B0B0F] leading-tight mt-14 mb-6',
        h3: 'text-2xl md:text-3xl font-semibold tracking-tight text-[#0B0B0F] mt-12 mb-5',
        h4: 'text-xl md:text-2xl font-semibold tracking-tight text-[#0B0B0F] mt-10 mb-4',
        h5: 'text-lg md:text-xl font-semibold tracking-tight text-[#0B0B0F] mt-8 mb-3',
        h6: 'text-base md:text-lg font-semibold tracking-tight text-[#0B0B0F] mt-6 mb-3',
      };
      const tag = (node.tag as HeadingTagName) ?? 'h2';
      const headingTag: HeadingTagName = headingClasses[tag] ? tag : 'h2';

      return React.createElement(
        headingTag,
        {
          key: index,
          className: headingClasses[headingTag],
        },
        node.children?.map((child, childIndex) => serializeNode(child, childIndex)),
      );
    }
      
    case 'list': {
      const listTag = node.tag === 'ol' ? 'ol' : 'ul';
      const listClasses =
        listTag === 'ol'
          ? 'mb-6 ml-6 list-decimal space-y-3 text-lg leading-8 text-[#2F3140]'
          : 'mb-6 ml-6 list-disc space-y-3 text-lg leading-8 text-[#2F3140]';

      return React.createElement(
        listTag,
        {
          key: index,
          className: listClasses,
        },
        node.children?.map((child, childIndex) => serializeNode(child, childIndex)),
      );
    }
      
    case 'listitem':
      return (
        <li key={index} className="pl-2">
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </li>
      );
      
    case 'quote':
      return (
        <blockquote
          key={index}
          className="my-10 rounded-r-3xl border-l-4 border-[#55B948] bg-[#F4FBF5] px-6 py-5 text-lg leading-8 text-[#1E2A22]"
        >
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </blockquote>
      );
      
    case 'link':
      return (
        <a 
          key={index} 
          href={node.url} 
          target={node.target || '_self'}
          rel={node.rel}
          className="font-medium text-[#2450D3] underline decoration-2 underline-offset-[6px] transition hover:text-[#163AA3]"
        >
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </a>
      );
      
    case 'linebreak':
      return <br key={index} />;
      
    case 'horizontalrule':
      return <hr key={index} className="my-12 border-t border-[#E4E7EF]" />;

    case 'upload': {
      if (
        node.relationTo === 'media' &&
        node.value &&
        typeof node.value === 'object' &&
        'url' in node.value
      ) {
        const media = node.value as {
          url?: string | null;
          alt?: string | null;
          width?: number | null;
          height?: number | null;
          caption?: string | null;
        };
        if (!media.url) return null;

        return (
          <figure
            key={index}
            className="my-12 overflow-hidden rounded-3xl bg-[#F7F9FC] p-6"
          >
            <img
              src={media.url}
              alt={media.alt ?? ''}
              className="mx-auto block h-auto w-full max-w-3xl rounded-2xl object-cover"
              width={media.width ?? undefined}
              height={media.height ?? undefined}
            />
            {media.caption ? (
              <figcaption className="mt-4 text-center text-sm text-[#4F5563]">
                {media.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      }
      return null;
    }
      
    default:
      // For unknown node types, try to render children if they exist
      if (node.children) {
        return (
          <div key={index}>
            {node.children.map((child, childIndex) => serializeNode(child, childIndex))}
          </div>
        );
      }
      return null;
  }
};

export const serializeLexical = (content: any): React.ReactNode => {
  if (!content) return null;
  
  // Handle both string and object content
  let lexicalContent: LexicalContent;
  
  if (typeof content === 'string') {
    try {
      lexicalContent = JSON.parse(content);
    } catch (e) {
      // If it's not valid JSON, treat it as plain text
      return <p>{content}</p>;
    }
  } else {
    lexicalContent = content;
  }
  
  if (!lexicalContent?.root?.children) {
    return <p>No content available</p>;
  }
  
  return (
    <div className="lexical-content">
      {lexicalContent.root.children.map((node, index) => serializeNode(node, index))}
    </div>
  );
};
