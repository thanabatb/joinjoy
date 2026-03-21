import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell stack">
      <section className="hero-panel stack">
        <span className="eyebrow">Not found</span>
        <h1 className="section-title">This event could not be found.</h1>
        <p className="lede">
          The share token may be wrong, or the mock data has been reset. Start again from home or
          open the seeded demo event.
        </p>
        <div className="button-row">
          <Link className="button" href="/">
            Go home
          </Link>
          <Link className="button-secondary" href="/event/jazz-night-demo">
            Open demo event
          </Link>
        </div>
      </section>
    </main>
  );
}
