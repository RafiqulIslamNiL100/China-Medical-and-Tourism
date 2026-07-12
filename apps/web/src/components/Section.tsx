import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-6xl px-6 ${className}`}>{children}</div>;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-neutral-300/70 bg-primary-100/60">
      <Container className="flex flex-col gap-4 py-14">
        {eyebrow ? (
          <span className="text-xs font-bold tracking-wide text-primary-700 uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="max-w-3xl text-3xl font-bold text-neutral-900 sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-lg text-neutral-700">{description}</p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
