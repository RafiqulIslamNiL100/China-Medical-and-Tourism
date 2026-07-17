/** Renders a schema.org JSON-LD <script> tag. `data` should come from one of the
 * builders in lib/structured-data.ts. */
export function JsonLd({ data }: { data: object }) {
  return (
    // eslint-disable-next-line react/no-danger -- JSON.stringify output, not user HTML
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
