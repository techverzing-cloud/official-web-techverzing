"use client";
import { useRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties; // Added here
  disabled?: boolean;
  [key: `data-${string}`]: string | undefined;
};

export default function GButton({
  variant = "primary",
  size = "md",
  children,
  onClick,
  className,
  style, // destructure style
  type,
  disabled,
  ...rest
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      data-cursor-hover
      type={type}
      disabled={disabled}
      style={style} // Pass style here
      className={twMerge(
        clsx(
          "font-semibold transition-[color,background-color,border-color,transform] duration-200 ease-out cursor-pointer rounded-lg active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          size === "sm" && "px-3 py-1 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          variant === "primary" && "bg-primary/90 text-white hover:bg-cream-white/70 hover:text-primary",
          variant === "secondary" &&
            "bg-transparent border border-primary border-dashed text-primary/80 hover:bg-white hover:text-primary",
          className
        )
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
