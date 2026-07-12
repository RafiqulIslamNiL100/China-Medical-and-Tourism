import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  accent: "bg-accent-600 text-[#241505] hover:bg-accent-700",
  secondary:
    "bg-transparent text-neutral-900 border border-neutral-300 hover:bg-neutral-100",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-100",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4.5 py-2.5",
  lg: "text-base px-6 py-3",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", children, className = "" } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _href, className: _className, variant: _variant, size: _size, ...buttonProps } =
    props as ButtonAsButton;
  void _href;
  void _className;
  void _variant;
  void _size;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
