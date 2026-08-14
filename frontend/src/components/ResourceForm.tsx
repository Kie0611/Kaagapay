import { useState } from "react";
import { BARANGAYS, CATEGORIES, SILANG_CENTER, resourceSchema } from "@/lib/kaagapay";
import type { ResourceInput } from "@/lib/kaagapay";

export const emptyResource: ResourceInput = {
  name: "",
  organization: "",
  category: "health",
  address: "",
  barangay: "",
  phone: "",
  hours: "",
  cost: "free",
  description: "",
  lat: SILANG_CENTER[0],
  lng: SILANG_CENTER[1],
  submitter_name: "",
  submitter_email: "",
};

type Props = {
  initial?: ResourceInput;
  onSubmit: (values: ResourceInput) => Promise<void> | void;
  submitting?: boolean;
  submitLabel?: string;
  showSubmitter?: boolean;
};

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-navy";

function Field({
  name,
  label,
  errors,
  children,
}: {
  name: string;
  label: string;
  errors: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      {children}
      {errors[name] && <span className="mt-1 block text-xs font-medium text-flagred">{errors[name]}</span>}
    </label>
  );
}

export function ResourceForm({
  initial = emptyResource,
  onSubmit,
  submitting,
  submitLabel = "Submit Resource",
  showSubmitter = true,
}: Props) {
  const [values, setValues] = useState<ResourceInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof ResourceInput>(key: K, value: ResourceInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = resourceSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0]);
        if (!next[key]) next[key] = i.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    await onSubmit(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field errors={errors} name="name" label="Service name">
          <input className={inputClass} value={values.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
      </div>

      <Field errors={errors} name="organization" label="Organization / agency">
        <input className={inputClass} value={values.organization} onChange={(e) => set("organization", e.target.value)} />
      </Field>

      <Field errors={errors} name="category" label="Category">
        <select className={inputClass} value={values.category} onChange={(e) => set("category", e.target.value as ResourceInput["category"])}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="sm:col-span-2">
        <Field errors={errors} name="address" label="Address">
          <input className={inputClass} value={values.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </div>

      <Field errors={errors} name="barangay" label="Barangay">
        <input
          list="kg-barangays"
          className={inputClass}
          value={values.barangay}
          onChange={(e) => set("barangay", e.target.value)}
        />
        <datalist id="kg-barangays">
          {BARANGAYS.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
      </Field>

      <Field errors={errors} name="phone" label="Phone number">
        <input className={inputClass} value={values.phone} onChange={(e) => set("phone", e.target.value)} />
      </Field>

      <Field errors={errors} name="hours" label="Operating hours">
        <input
          className={inputClass}
          placeholder="Monday–Friday 8AM–5PM"
          value={values.hours}
          onChange={(e) => set("hours", e.target.value)}
        />
      </Field>

      <Field errors={errors} name="cost" label="Cost">
        <div className="flex gap-2">
          {(["free", "with_fee", "depends"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("cost", c)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                values.cost === c
                  ? "border-navy bg-navy text-primary-foreground"
                  : "border-border bg-secondary text-navy hover:bg-border/60"
              }`}
            >
              {c === "free" ? "Free" : c === "with_fee" ? "With fee" : "Depends"}
            </button>
          ))}
        </div>
      </Field>

      <div className="sm:col-span-2">
        <Field errors={errors} name="description" label="Description">
          <textarea
            rows={4}
            className={inputClass}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </div>

      <Field errors={errors} name="lat" label="Latitude">
        <input className={inputClass} value={values.lat} onChange={(e) => set("lat", e.target.value as never)} />
      </Field>
      <Field errors={errors} name="lng" label="Longitude">
        <input className={inputClass} value={values.lng} onChange={(e) => set("lng", e.target.value as never)} />
      </Field>

      {showSubmitter && (
        <>
          <Field errors={errors} name="submitter_name" label="Your name (optional)">
            <input className={inputClass} value={values.submitter_name ?? ""} onChange={(e) => set("submitter_name", e.target.value)} />
          </Field>
          <Field errors={errors} name="submitter_email" label="Your email (optional)">
            <input className={inputClass} value={values.submitter_email ?? ""} onChange={(e) => set("submitter_email", e.target.value)} />
          </Field>
        </>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : submitLabel}
        </button>
      </div>
    </form>
  );
}