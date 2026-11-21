import { Fragment, type ElementType } from "react";

/** Título con reveal palabra por palabra al entrar en pantalla (activado por ClientEffects). */
export default function SplitHeading({
  as: Tag = "h2",
  text,
  className = "",
  accent,
  id,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  accent?: { text: string; className: string };
  id?: string;
}) {
  const words = text.split(" ");
  const accentWords = accent ? accent.text.split(" ") : [];
  const all = [
    ...words.map((w) => ({ w, a: false })),
    ...accentWords.map((w) => ({ w, a: true })),
  ];
  return (
    <Tag id={id} className={`split ${className}`}>
      {all.map((it, i) => (
        <Fragment key={i}>
          <span
            style={{ ["--i" as string]: i }}
            className={it.a ? accent!.className : undefined}
          >
            {it.w}
          </span>
          {i < all.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
