import { useState } from "react";
import { X } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { ResourceForm, emptyResource } from "@/components/ResourceForm";
import { COST_LABELS, categoryLabel } from "@/lib/kaagapay";
import type { Resource, ResourceInput } from "@/lib/kaagapay";
import { MapPin, Phone, Clock, Wallet, LocateFixed } from "lucide-react";

// Replace with hooks later
const MOCK_DATA: Resource[] = [];

export function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError]       = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Replace with useLogin() hook later
      console.log("Login attempt:", password);
      setError("Incorrect password. Please try again.");
    } catch {
      setError("Incorrect password. Please try again.");
    }
  }

  if (!unlocked) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-sm px-4 py-24">
          <div className="rounded-xl border-[1.5px] border-border bg-card p-6 shadow-card">
            <h1 className="text-xl text-foreground">Admin Login</h1>
            <p className="mt-1 text-xs text-muted-foreground">Enter the admin password.</p>
            <form onSubmit={login} className="mt-5 grid gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-navy"
              />
              {error && <p className="text-xs font-medium text-flagred">{error}</p>}
              <button type="submit" className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </SiteShell>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const [tab, setTab]     = useState<"resources" | "pending">("resources");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing?: Resource }>({ open: false });

  const data      = MOCK_DATA;
  const isLoading = false;

  const pending  = data.filter((r) => r.status === "pending");
  const live     = data.filter((r) => r.status !== "pending" && r.status !== "rejected");
  const filtered = live.filter((r) =>
    `${r.name} ${r.organization} ${r.barangay}`.toLowerCase().includes(query.toLowerCase()),
  );

  const stats = [
    { label: "Total resources",     value: live.length },
    { label: "Pending submissions", value: pending.length },
    { label: "Categories covered",  value: new Set(data.map((r) => r.category)).size },
    { label: "Barangays covered",   value: new Set(data.map((r) => r.barangay)).size },
  ];

  async function handleSave(values: ResourceInput) {
    // Replace with useCreateResource() / useUpdateResource() hooks later
    console.log(modal.editing ? "update" : "create", values);
    setModal({ open: false });
  }

  function handleStatus(id: string, status: string) {
    // Replace with useUpdateResourceStatus() hook later
    console.log("status change", id, status);
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage the Kaagapay directory.</p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ open: true })}
            className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            + Add Resource
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border-[1.5px] border-border bg-card p-5 shadow-card">
              <p className="text-3xl font-bold text-navy">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1 shadow-card">
          {([["resources", "Resources"], ["pending", `Pending (${pending.length})`]] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === value ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:text-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading...</p>}

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
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                      <td className="px-4 py-3">
                        <span className={`cat-badge cat-${r.category}`}>{categoryLabel(r.category)}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.barangay}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          r.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
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
                          onClick={() => handleStatus(r.id, r.status === "active" ? "inactive" : "active")}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-flagred hover:bg-secondary"
                        >
                          {r.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No resources match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "pending" && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {pending.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground">No pending submissions right now. 🎉</p>
            )}
            {pending.map((r) => (
              <div key={r.id} className="rounded-xl border-[1.5px] border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.organization}</p>
                  </div>
                  <span className={`cat-badge cat-${r.category}`}>{categoryLabel(r.category)}</span>
                </div>
                <dl className="mt-3 grid gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><MapPin className="size-3 shrink-0" /> {r.address} · {r.barangay}</div>
                  <div className="flex items-center gap-1.5"><Phone className="size-3 shrink-0" /> {r.phone}</div>
                  <div className="flex items-center gap-1.5"><Clock className="size-3 shrink-0" /> {r.hours}</div>
                  <div className="flex items-center gap-1.5"><Wallet className="size-3 shrink-0" /> {COST_LABELS[r.cost]}</div>
                  <div className="flex items-center gap-1.5"><LocateFixed className="size-3 shrink-0" /> {r.lat}, {r.lng}</div>
                </dl>
                <p className="mt-3 text-sm text-foreground/80">{r.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatus(r.id, "active")}
                    className="flex-1 rounded-lg bg-success px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(r.id, "rejected")}
                    className="flex-1 rounded-lg bg-flagred px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-900 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="mt-10 w-full max-w-3xl rounded-xl border-[1.5px] border-border bg-card p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl text-foreground">
                {modal.editing ? "Edit Resource" : "Add Resource"}
              </h2>
              <button type="button" onClick={() => setModal({ open: false })} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <ResourceForm
              showSubmitter={false}
              submitLabel={modal.editing ? "Save changes" : "Add to directory"}
              initial={modal.editing ? {
                ...emptyResource,
                name:         modal.editing.name,
                organization: modal.editing.organization,
                category:     modal.editing.category,
                address:      modal.editing.address,
                barangay:     modal.editing.barangay,
                phone:        modal.editing.phone,
                hours:        modal.editing.hours,
                cost:         modal.editing.cost,
                description:  modal.editing.description,
                lat:          modal.editing.lat,
                lng:          modal.editing.lng,
              } : emptyResource}
              onSubmit={handleSave}
            />
          </div>
        </div>
      )}
    </SiteShell>
  );
}