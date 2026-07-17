import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents = {
  h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
    <h2 className="mt-8 mb-3 text-xl font-bold text-neutral-900 first:mt-0" {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-8 mb-3 text-xl font-bold text-neutral-900 first:mt-0" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 mb-2 font-bold text-neutral-900" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className="mb-3 text-neutral-700" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-3 ml-5 list-disc text-neutral-700" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-3 ml-5 list-decimal text-neutral-700" {...props} />
  ),
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="mb-1" {...props} />,
  strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-neutral-900" {...props} />
  ),
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a className="font-semibold text-primary-700 hover:underline" {...props} />
  ),
  table: (props: React.ComponentPropsWithoutRef<"table">) => (
    <div className="mb-4 overflow-x-auto rounded-[10px] border border-neutral-300">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  thead: (props: React.ComponentPropsWithoutRef<"thead">) => (
    <thead className="border-b border-neutral-300 bg-neutral-100 text-xs font-semibold text-neutral-500 uppercase" {...props} />
  ),
  th: (props: React.ComponentPropsWithoutRef<"th">) => <th className="px-4 py-3" {...props} />,
  td: (props: React.ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-neutral-100 px-4 py-3 align-top text-neutral-700 last:border-0" {...props} />
  ),
};

/** Shared GFM-Markdown renderer with the site's prose styling — used for hospital
 * rich profiles and blog article bodies. */
export function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {children}
    </ReactMarkdown>
  );
}
