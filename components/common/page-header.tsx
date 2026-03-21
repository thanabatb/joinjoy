import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="hero-panel paper-cluster stack">
      <div className="toolbar">
        <div className="eyebrow">{eyebrow}</div>
        <Link className="button-ghost" href="/">
          Back home
        </Link>
      </div>
      <div className="stack">
        <h1 className="section-title">{title}</h1>
        <p className="lede">{description}</p>
      </div>
      {actions}
    </header>
  );
}
