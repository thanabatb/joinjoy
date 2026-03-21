import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell stack">
      <section className="hero-panel stack">
        <div className="eyebrow">Claim what you had. Split with joy.</div>
        <div className="grid-2" style={{ alignItems: "end" }}>
          <div className="stack">
            <h1 className="display">A friendly split flow for social events.</h1>
            <p className="lede">
              JoinJoy frames bill splitting as an event experience: add the outing, invite the group,
              let people claim what they had, and keep the math on the server.
            </p>
            <div className="button-row">
              <Link className="button" href="/create">
                Create event
              </Link>
              <Link className="button-secondary" href="/event/jazz-night-demo">
                Join demo event
              </Link>
            </div>
          </div>
          <div className="stack">
            <div className="card stack">
              <span className="eyebrow">MVP flow</span>
              <div className="metric-list">
                <div className="metric-row">
                  <span className="muted">1. Create the outing</span>
                  <strong>Host setup</strong>
                </div>
                <div className="metric-row">
                  <span className="muted">2. Add members and items</span>
                  <strong>Draft the bill</strong>
                </div>
                <div className="metric-row">
                  <span className="muted">3. Claim and split</span>
                  <strong>Collaborative</strong>
                </div>
                <div className="metric-row">
                  <span className="muted">4. Finalize and settle</span>
                  <strong>Track payments</strong>
                </div>
              </div>
            </div>
            <div className="notice">
              This first implementation pass uses mock data and mock APIs, but the project structure
              already matches the documentation for the Supabase-backed version.
            </div>
          </div>
        </div>
      </section>

      <section className="grid-3">
        <div className="card stack">
          <h2 className="section-title">Event first</h2>
          <p className="muted">
            The product feels like joining an outing, not entering a spreadsheet.
          </p>
        </div>
        <div className="card stack">
          <h2 className="section-title">Server-owned money logic</h2>
          <p className="muted">
            Split, SC, VAT, estimated totals, and finalization all live in dedicated calculation files.
          </p>
        </div>
        <div className="card stack">
          <h2 className="section-title">No login for MVP</h2>
          <p className="muted">
            Participants join through the event link and identify themselves only inside that event.
          </p>
        </div>
      </section>
    </main>
  );
}
