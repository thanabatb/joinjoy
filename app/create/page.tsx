import { HistoryBackButton } from "@/components/common/history-back-button";
import { CreateEventForm } from "@/components/event/create-event-form";

export default function CreatePage() {
  return (
    <>
      <main className="page-shell create-page">
        <header className="create-topbar">
          <div className="create-topbar-row">
            <HistoryBackButton ariaLabel="Back home" className="create-back" fallbackHref="/">
              <span>←</span>
            </HistoryBackButton>
            <h1 className="create-topbar-title">Create Event</h1>
          </div>
        </header>

        <section className="create-intro">
          <h2 className="create-intro-title">Let's gather.</h2>
          <p className="muted">Set up your shared outing in seconds.</p>
        </section>

        <CreateEventForm formId="create-event-form" />
      </main>

      <footer className="create-footer">
        <button className="button create-footer-button" form="create-event-form" type="submit">
          Continue
        </button>
      </footer>
    </>
  );
}
