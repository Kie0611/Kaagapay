import { useState } from "react";
import { X } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { ResourceForm, emptyResource } from "@/components/ResourceForm";
import { COST_LABELS, categoryLabel } from "@/lib/kaagapay";
import type { Resource, ResourceInput } from "@/lib/kaagapay";
import {
  useLogin,
  useAdminResources,
  useAdminSubmissions,
  useAdminStats,
  useCreateResource,
  useUpdateResource,
  useUpdateResourceStatus,
  useApproveSubmission,
  useRejectSubmission,
} from "@/hooks/useAdmin";

export function AdminPage() {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("kaagapay-token"),
  );

  if (!token) {
    return <LoginView onLogin={(t) => { localStorage.setItem("kaagapay-token", t); setToken(t); }} />;
  }

  return (
    <Dashboard
      onLogout={() => {
        localStorage.removeItem("kaagapay-token");
        setToken(null);
      }}
    />
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginView({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending, isError } = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(
      { username, password },
      { onSuccess: (data) => onLogin(data.token) },
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-sm px-4 py-24">
        <div className="rounded-xl border-[1.5px] border-border bg-card p-6 shadow-card">
          <h1 className="text-xl text-foreground">Admin Login</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter your admin credentials.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
            {isError && (
              <p className="text-xs font-medium text-destructive">
                Incorrect credentials. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </SiteShell>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab]     = useState<"resources" | "pending">("resources");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing?: Resource }>({ open: false });

  const { data: resources = [],   isLoading: loadingResources }   = useAdminResources();
  const { data: submissions = [], isLoading: loadingSubmissions }  = useAdminSubmissions();
  const { data: stats }                                            = useAdminStats();

  const { mutate: createResource, isPending: creating }   = useCreateResource();
  const { mutate: updateResource, isPending: updating }   = useUpdateResource();
  const { mutate: updateStatus }                          = useUpdateResourceStatus();
  const { mutate: approve, isPending: approving }         = useApproveSubmission();
  const { mutate: reject,  isPending: rejecting }         = useRejectSubmission();

  const filtered = resources.filter((r) =>
    `${r.name} ${r.organization} ${r.barangay}`.toLowerCase().includes(query.toLowerCase()),
  );

  function handleSave(values: ResourceInput) {
    const payload = {
      name:         values.name,
      organization: values.organization,
      category:     values.category,
      address:      values.address,
      barangay:     values.barangay,
      phone:        values.phone,
      hours:        values.hours,
      cost:         values.cost,
      description:  values.description,
      lat:          String(values.lat),
      lng:          String(values.lng),
    };

    if (modal.editing) {
      updateResource(
        { id: modal.editing.id, data: payload },
        { onSuccess: () => setModal({ open: false }) },
      );
    } else {
      createResource(payload, { onSuccess: () => setModal({ open: false }) });
    }
  }

  const statCards = [
    { label: "Total resources",     value: stats?.totalResources     ?? "—" },
    { label: "Pending submissions", value: stats?.pendingSubmissions ?? "—" },
    { label: "Categories covered",  value: stats?.categoriesCount    ?? "—" },
    { label: "Barangays covered",   value: stats?.barangaysCount     ?? "—" },
  ];

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-10">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the Kaagapay directory.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModal({ open: true })}
              className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              + Add Resource
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border-[1.5px] border-border bg-card p-5 shadow-card"
            >
              <p className="text-3xl font-bold text-navy">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1 shadow-card">
          {([
            ["resources", "Resources"],
            ["pending",   `Pending (${submissions.length})`],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === value
                  ? "bg-navy text-primary-foreground"
                  : "text-muted-foreground hover:text-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Resources tab */}
        {tab === "resources" && (
          <div className="mt-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="mb-4 w-full max-w-sm rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
            <div className="overflow-x-auto rounded-xl border-[1.5px] border-border bg-card shadow-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Barangay</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingResources ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td colSpan={5} className="px-4 py-3">
                          <div className="h-4 animate-pulse rounded bg-secondary" />
                        </td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No resources match your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.organization}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`cat-badge cat-${r.category}`}>
                            {categoryLabel(r.category)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.barangay}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            r.status === "active"
                              ? "bg-success/15 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {r.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setModal({ open: true, editing: r })}
                            className="mr-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-secondary"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus({
                                id:     r.id,
                                status: r.status === "active" ? "inactive" : "active",
                              })
                            }
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-flagred hover:bg-secondary"
                          >
                            {r.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending tab */}
        {tab === "pending" && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {loadingSubmissions ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-secondary" />
              ))
            ) : submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending submissions right now. 🎉
              </p>
            ) : (
              submissions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border-[1.5px] border-border bg-card p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.organization}</p>
                    </div>
                    <span className={`cat-badge cat-${s.category}`}>
                      {categoryLabel(s.category)}
                    </span>
                  </div>
                  <dl className="mt-3 grid gap-1 text-xs text-muted-foreground">
                    <div>📍 {s.address}{s.barangay ? `, ${s.barangay}` : ""}</div>
                    <div>📞 {s.phone}</div>
                    <div>🕒 {s.hours}</div>
                    <div>💰 {COST_LABELS[s.cost] ?? s.cost}</div>
                  </dl>
                  {s.description && (
                    <p className="mt-3 text-sm text-foreground/80">{s.description}</p>
                  )}
                  {s.submitterName && (
                    <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
                      Submitted by {s.submitterName}
                      {s.submitterEmail ? ` (${s.submitterEmail})` : ""}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      disabled={approving}
                      onClick={() => approve(s.id)}
                      className="flex-1 rounded-lg bg-success px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={rejecting}
                      onClick={() => reject(s.id)}
                      className="flex-1 rounded-lg bg-flagred px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modal.open && (
        <div className="fixed inset-0 z-[900] flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="mt-10 w-full max-w-3xl rounded-xl border-[1.5px] border-border bg-card p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl text-foreground">
                {modal.editing ? "Edit Resource" : "Add Resource"}
              </h2>
              <button
                type="button"
                onClick={() => setModal({ open: false })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <ResourceForm
              showSubmitter={false}
              submitLabel={modal.editing ? "Save changes" : "Add to directory"}
              submitting={creating || updating}
              initial={
                modal.editing
                  ? {
                      ...emptyResource,
                      name:         modal.editing.name,
                      organization: modal.editing.organization,
                      category:     modal.editing.category,
                      address:      modal.editing.address,
                      barangay:     modal.editing.barangay ?? "",
                      phone:        modal.editing.phone ?? "",
                      hours:        modal.editing.hours ?? "",
                      cost:         modal.editing.cost,
                      description:  modal.editing.description ?? "",
                      lat:          Number(modal.editing.lat),
                      lng:          Number(modal.editing.lng),
                    }
                  : emptyResource
              }
              onSubmit={handleSave}
            />
          </div>
        </div>
      )}
    </SiteShell>
  );
}