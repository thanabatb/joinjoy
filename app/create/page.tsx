import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { CreateEventForm } from "@/components/event/create-event-form";

export default function CreatePage() {
  return (
    <main className="page-shell stack">
      <PageHeader
        eyebrow="Screen 2"
        title="Create a new event"
        description="Start with the outing details and default cost rules. The host sets the frame, then the group helps resolve the rest."
        actions={
          <div className="button-row">
            <Link className="button-ghost" href="/event/jazz-night-demo">
              View seeded example
            </Link>
          </div>
        }
      />
      <CreateEventForm />
    </main>
  );
}
