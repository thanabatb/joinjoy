import { HistoryBackButton } from "@/components/common/history-back-button";

export function PageHeader({
  backHref = "/",
  eyebrow,
  title,
  description,
  actions
}: {
  backHref?: string;
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="hero-panel paper-cluster stack">
      <div className="toolbar">
        <div className="eyebrow">{eyebrow}</div>
        <HistoryBackButton className="button-ghost" fallbackHref={backHref}>
          Back
        </HistoryBackButton>
      </div>
      <div className="stack">
        <h1 className="section-title">{title}</h1>
        <p className="lede">{description}</p>
      </div>
      {actions}
    </header>
  );
}
