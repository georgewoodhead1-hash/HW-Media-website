// Serialize JSON-LD for inlining into a <script> tag. Escapes "<" so no
// content string can ever close the tag early ("</script>" breakout) — required
// whenever JSON is injected into HTML via dangerouslySetInnerHTML.
export const jsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");
