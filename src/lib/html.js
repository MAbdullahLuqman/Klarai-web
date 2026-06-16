const htmlEntities = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  apos: "'",
  nbsp: " ",
};

export function decodeHtmlEntities(value = "") {
  return String(value).replace(/&(#?\w+);/g, (match, entity) => htmlEntities[entity] ?? match);
}

export function normalizeStoredHtml(value = "") {
  const html = String(value);
  if (!/&lt;\/?[a-z][\s\S]*?&gt;/i.test(html)) return html;

  return decodeHtmlEntities(html);
}

export function stripHtml(value = "") {
  return decodeHtmlEntities(normalizeStoredHtml(value).replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

