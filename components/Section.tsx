import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  tone?: "light" | "white" | "dark";
};

export function Section({ id, eyebrow, title, children, tone = "light" }: SectionProps) {
  return (
    <section id={id} className={`section section-${tone}`}>
      <div className="container">
        {(eyebrow || title) && (
          <div className="section-heading">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}