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
        <p key={index} className="mb-4">
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </p>
      );
      
    case 'heading':
      const HeadingTag = (node.tag || 'h2') as keyof JSX.IntrinsicElements;
      const headingClasses = {
        h1: 'text-3xl font-bold mb-4 mt-8',
        h2: 'text-2xl font-bold mb-3 mt-6',
        h3: 'text-xl font-bold mb-2 mt-4',
        h4: 'text-lg font-bold mb-2 mt-3',
        h5: 'text-base font-bold mb-2 mt-2',
        h6: 'text-sm font-bold mb-2 mt-2',
      };
      
      return (
        <HeadingTag key={index} className={headingClasses[node.tag as keyof typeof headingClasses] || headingClasses.h2}>
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </HeadingTag>
      );
      
    case 'list':
      const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
      const listClasses = node.tag === 'ol' ? 'list-decimal list-inside mb-4' : 'list-disc list-inside mb-4';
      
      return (
        <ListTag key={index} className={listClasses}>
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </ListTag>
      );
      
    case 'listitem':
      return (
        <li key={index} className="mb-1">
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </li>
      );
      
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic mb-4">
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
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </a>
      );
      
    case 'linebreak':
      return <br key={index} />;
      
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
