import Image from "next/image";
import React from "react";

type LexicalFormat =
  | 0
  | 1
  | 2
  | 4
  | 8
  | 16
  | (0 | 1 | 2 | 4 | 8 | 16);

interface LexicalNode {
  type: string;
  version?: number;
  children?: LexicalNode[];
  text?: string;
  format?: LexicalFormat;
  style?: string;
  indent?: number;
  direction?: string;
  tag?: string;
  url?: string;
  rel?: string;
  target?: string;
  relationTo?: string;
  value?: unknown;
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

const formatText = (text: string, format?: LexicalFormat): React.ReactNode => {
  if (!format) return text;

  let formatted: React.ReactNode = text;

  if (format & 1) formatted = <strong>{formatted}</strong>;
  if (format & 2) formatted = <em>{formatted}</em>;
  if (format & 4) formatted = <s>{formatted}</s>;
  if (format & 8) formatted = <u>{formatted}</u>;
  if (format & 16)
    formatted = (
      <code className="rounded bg-[#F5F6FA] px-1 py-0.5 text-sm text-[#0B0B0F]">
        {formatted}
      </code>
    );

  return formatted;
};

const serializeNode = (node: LexicalNode, index: number): React.ReactNode => {
  switch (node.type) {
    case "text":
      return formatText(node.text ?? "", node.format);

    case "paragraph":
      return (
        <p key={index} className="mb-6 text-lg leading-8 text-[#2F3140]">
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </p>
      );

    case "heading": {
      type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      const tag = ((node.tag as HeadingTag) ?? "h2").toLowerCase() as HeadingTag;
      const headingClasses: Record<HeadingTag, string> = {
        h1: "text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-[#0B0B0F] mt-16 mb-8 first:mt-0",
        h2: "text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-[#0B0B0F] mt-14 mb-6",
        h3: "text-2xl md:text-3xl font-semibold tracking-tight text-[#0B0B0F] mt-12 mb-5",
        h4: "text-xl md:text-2xl font-semibold tracking-tight text-[#0B0B0F] mt-10 mb-4",
        h5: "text-lg md:text-xl font-semibold tracking-tight text-[#0B0B0F] mt-8 mb-3",
        h6: "text-base md:text-lg font-semibold tracking-tight text-[#0B0B0F] mt-6 mb-3",
      };

      const HeadingComponent = headingClasses[tag] ? tag : "h2";

      return React.createElement(
        HeadingComponent,
        { key: index, className: headingClasses[HeadingComponent] },
        node.children?.map((child, childIndex) => serializeNode(child, childIndex)),
      );
    }

    case "list": {
      const isOrdered = node.tag === "ol";
      const Tag = isOrdered ? "ol" : "ul";
      const listClasses = isOrdered
        ? "mb-6 ml-6 list-decimal space-y-3 text-lg leading-8 text-[#2F3140]"
        : "mb-6 ml-6 list-disc space-y-3 text-lg leading-8 text-[#2F3140]";
      return (
        <Tag key={index} className={listClasses}>
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </Tag>
      );
    }

    case "listitem":
      return (
        <li key={index} className="pl-2">
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </li>
      );

    case "quote":
      return (
        <blockquote
          key={index}
          className="my-10 rounded-r-3xl border-l-4 border-[#55B948] bg-[#F4FBF5] px-6 py-5 text-lg leading-8 text-[#1E2A22]"
        >
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </blockquote>
      );

    case "link":
      return (
        <a
          key={index}
          href={node.url ?? "#"}
          target={node.target ?? "_self"}
          rel={node.rel ?? undefined}
          className="font-medium text-[#2450D3] underline decoration-2 underline-offset-[6px] transition hover:text-[#163AA3]"
        >
          {node.children?.map((child, childIndex) => serializeNode(child, childIndex))}
        </a>
      );

    case "linebreak":
      return <br key={index} />;

    case "horizontalrule":
      return <hr key={index} className="my-12 border-t border-[#E4E7EF]" />;

    case "upload": {
      if (
        node.relationTo === "media" &&
        node.value &&
        typeof node.value === "object" &&
        "url" in node.value &&
        typeof node.value.url === "string"
      ) {
        const media = node.value as {
          url: string;
          alt?: string | null;
          width?: number | null;
          height?: number | null;
          caption?: string | null;
        };

        return (
          <figure
            key={index}
            className="my-12 overflow-hidden rounded-3xl bg-[#F7F9FC] p-6"
          >
            <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl">
              <Image
                src={media.url}
                alt={media.alt ?? ""}
                fill
                className="rounded-2xl object-cover"
                sizes="(min-width: 1024px) 768px, 100vw"
              />
            </div>
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

export const serializeLexical = (content: unknown): React.ReactNode => {
  if (!content) return null;

  let lexicalContent: LexicalContent | null = null;

  if (typeof content === "string") {
    try {
      lexicalContent = JSON.parse(content) as LexicalContent;
    } catch {
      return <p>{content}</p>;
    }
  } else if (typeof content === "object" && content !== null) {
    lexicalContent = content as LexicalContent;
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
