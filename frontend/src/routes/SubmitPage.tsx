import { Link } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { ResourceForm, emptyResource } from "@/components/ResourceForm";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import type { ResourceInput } from "@/lib/kaagapay";

export function SubmitPage() {
  const { mutate: submit, isPending, isSuccess, isError } = useCreateSubmission();

  function handleSubmit(values: ResourceInput) {
    submit({
      name:            values.name,
      organization:    values.organization,
      category:        values.category,
      address:         values.address,
      barangay:        values.barangay,
      phone:           values.phone,
      hours:           values.hours,
      cost:            values.cost,
      description:     values.description,
      submitterName:   values.submitter_name ?? undefined,
      submitterEmail:  values.submitter_email ?? undefined,
    });
  }

  if (isSuccess) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-lg px-4 py-24 text-center">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-5 text-2xl text-foreground">
            Thank you for your submission!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We received your information. Our volunteer team will review it within
            2–3 business days. Once verified, it will appear in the Kaagapay directory.
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
              onClick={() => window.location.reload()}
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

        {isError && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            Something went wrong. Please try again.
          </div>
        )}

        <div className="mt-8 rounded-xl border-[1.5px] border-border bg-card p-6 shadow-card sm:p-8">
          <ResourceForm
            initial={emptyResource}
            onSubmit={handleSubmit}
            submitting={isPending}
          />
        </div>
      </div>
    </SiteShell>
  );
}