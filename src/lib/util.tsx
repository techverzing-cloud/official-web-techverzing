import Link from "next/link";

export interface LinkItem {
  label: string;
  path: string;
}

const highlightText = (
  text: string,
  highlights: string[] = ["Techverzing"],
  links: LinkItem[] = []
) => {
  if (
    (!highlights || highlights.length === 0) &&
    (!links || links.length === 0)
  ) {
    return text;
  }

  // Combine highlights and link labels into one search set
  const searchTerms = [...highlights, ...links.map((l) => l.label)];

  const regex = new RegExp(`(${searchTerms.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const matchLink = links.find(
      (l) => l.label.toLowerCase() === part.toLowerCase()
    );
    if (matchLink) {
      return (
        <Link
          key={`link-${i}`}
          href={matchLink.path}
          className="text-primary hover:text-black duration-200 transition-colors"
        >
          {matchLink.label}
        </Link>
      );
    }

    if (highlights.some((word) => word.toLowerCase() === part.toLowerCase())) {
      return <strong key={`highlight-${i}`}>{part}</strong>;
    }

    return part;
  });
};
const slugger = (value: string) => {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
};

const renderTextWithHighlights = (
  text: string,
  highlights: string[],
  highlightClass = "text-white font-semibold"
) => {
  const escaped = highlights.map((h) =>
    h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");

  return text.split(regex).map((part, idx) => {
    if (part === "\n") {
      return <br key={idx} />;
    }

    const isHighlight = highlights.some(
      (h) => h.toLowerCase() === part.toLowerCase()
    );

    return isHighlight ? (
      <strong key={idx} className={highlightClass}>
        {part}
      </strong>
    ) : (
      <span key={idx}>{part}</span>
    );
  });
};

export { highlightText, slugger, renderTextWithHighlights };