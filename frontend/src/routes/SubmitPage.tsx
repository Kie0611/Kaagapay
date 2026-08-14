import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { ResourceForm, emptyResource } from "@/components/ResourceForm";
import type { ResourceInput } from "@/lib/kaagapay";
import { PartyPopper } from "lucide-react";

export function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values: ResourceInput) {
    setSubmitting(true);
    try {
      // Replace with useCreateSubmission() hook later
      console.log("Submission:", values);
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-lg px-4 py-24 text-center">
          <PartyPopper className="mx-auto size-12 text-gold" />
          <h1 className="mt-5 text-2xl text-foreground">Thank you for your submission!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We received your information. Our volunteer team will review it within 2–3 business days.
            Once verified, it will appear in the Kaagapay directory.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/resources"
              className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-navy hover:bg-secondary"
            >
              Back to the list
            </Link>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Submit another
            </button>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl text-foreground">Submit a Resource</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Share the details of a service. All submissions are reviewed before publishing.
        </p>
        <div className="mt-8 rounded-xl border-[1.5px] border-border bg-card p-6 shadow-card sm:p-6">
          <ResourceForm
            initial={emptyResource}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>
    </SiteShell>
  );
}