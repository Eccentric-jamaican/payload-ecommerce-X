import type { CSSProperties, FC } from "react";

interface AnimatedWordsProps {
  text: string;
  startDelay?: number;
  className?: string;
}

export const AnimatedWords: FC<AnimatedWordsProps> = ({
  text,
  startDelay = 0,
  className,
}) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const delay = startDelay + index * 100;
        const style: CSSProperties = {
          animationDelay: `${delay}ms`,
        };

        return (
          <span
            key={`${word}-${index}`}
            className="word-fade-up inline-block"
            style={style}
          >
            {word}&nbsp;
          </span>
        );
      })}
    </span>
  );
};

type AnimatedLine =
  | string
  | {
      text: string;
      className?: string;
    };

interface AnimatedHeadingProps {
  lines: AnimatedLine[];
  className?: string;
}

export const AnimatedHeading: FC<AnimatedHeadingProps> = ({
  lines,
  className,
}) => {
  let delayAccumulator = 0;

  return (
    <h1 className={className}>
      {lines.map((lineConfig, lineIndex) => {
        const { text, className: lineClass } =
          typeof lineConfig === "string"
            ? { text: lineConfig, className: undefined }
            : lineConfig;
        const lineStartDelay = delayAccumulator;
        delayAccumulator += text.trim().split(/\s+/).length * 100;

        return (
          <AnimatedWords
            key={`line-${lineIndex}`}
            text={text}
            startDelay={lineStartDelay}
            className={`block ${lineClass ?? ""}`}
          />
        );
      })}
    </h1>
  );
};
