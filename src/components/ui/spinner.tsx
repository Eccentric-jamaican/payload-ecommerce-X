import { FC } from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export const Spinner: FC<SpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-t-2 border-gray-900 ${sizeClasses[size]}`}
    ></div>
  );
};
