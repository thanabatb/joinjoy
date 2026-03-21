import Link from "next/link";

export function ShareLinkCard({ shareToken }: { shareToken: string }) {
  const path = `/event/${shareToken}`;

  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">Share the event</h2>
        <span className="eyebrow">No login in MVP</span>
      </div>
      <p className="lede">
        Participants can join with a lightweight event link and identify themselves by name inside the event.
      </p>
      <div className="card" style={{ background: "rgba(255,255,255,0.6)", boxShadow: "none" }}>
        <strong>{path}</strong>
      </div>
      <div className="button-row">
        <Link className="button-secondary" href={path}>
          Open event
        </Link>
        <Link className="button-ghost" href={`${path}/payment`}>
          Preview payment view
        </Link>
      </div>
    </section>
  );
}
