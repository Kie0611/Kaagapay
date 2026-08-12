import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema, type ResourceInput, CATEGORIES, BARANGAYS } from "../lib/kaagapay";
import { cn } from "../lib/utils";

interface ResourceFormProps {
  defaultValues?: Partial<ResourceInput>;
  onSubmit: (data: ResourceInput) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ResourceForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Submit Resource",
}: ResourceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceInput>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { cost: "free", ...defaultValues },
  });

  const cost = watch("cost");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Service name */}
      <Field label="Service name" error={errors.name?.message} required>
        <Input
          {...register("name")}
          placeholder="e.g. Silang Rural Health Unit"
          error={!!errors.name}
        />
      </Field>

      {/* Organization */}
      <Field label="Organization / agency" error={errors.organization?.message} required>
        <Input
          {...register("organization")}
          placeholder="e.g. LGU Silang"
          error={!!errors.organization}
        />
      </Field>

      {/* Category */}
      <Field label="Category" error={errors.category?.message} required>
        <select
          {...register("category")}
          className={cn(
            "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none",
            "focus:border-navy focus:ring-1 focus:ring-navy",
            errors.category && "border-destructive",
          )}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Address */}
      <Field label="Address" error={errors.address?.message} required>
        <Input
          {...register("address")}
          placeholder="e.g. Barangay Biga, Silang, Cavite"
          error={!!errors.address}
        />
      </Field>

      {/* Barangay */}
      <Field label="Barangay" error={errors.barangay?.message} required>
        <select
          {...register("barangay")}
          className={cn(
            "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none",
            "focus:border-navy focus:ring-1 focus:ring-navy",
            errors.barangay && "border-destructive",
          )}
        >
          <option value="">Select a barangay</option>
          {BARANGAYS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>

      {/* Phone */}
      <Field label="Phone number" error={errors.phone?.message} required>
        <Input
          {...register("phone")}
          type="tel"
          placeholder="e.g. (046) 686-0019 or 0917-800-1123"
          error={!!errors.phone}
        />
      </Field>

      {/* Hours */}
      <Field label="Operating hours" error={errors.hours?.message} required>
        <Input
          {...register("hours")}
          placeholder="Monday–Friday 8AM–5PM"
          error={!!errors.hours}
        />
      </Field>

      {/* Cost toggle */}
      <Field label="Cost" error={errors.cost?.message} required>
        <div className="flex gap-2">
          {(["free", "with_fee", "depends"] as const).map((val) => {
            const labels = { free: "Free", with_fee: "With fee", depends: "Depends" };
            return (
              <button
                key={val}
                type="button"
                onClick={() => setValue("cost", val)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                  cost === val
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-secondary text-muted-foreground hover:border-navy/50",
                )}
              >
                {labels[val]}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Description */}
      <Field label="Description" error={errors.description?.message} required>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Briefly describe the service and who it's for."
          className={cn(
            "w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none",
            "focus:border-navy focus:ring-1 focus:ring-navy",
            errors.description && "border-destructive",
          )}
        />
      </Field>

      {/* Coordinates (hidden — admin sets these on approval) */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Latitude" error={errors.lat?.message}>
          <Input
            {...register("lat")}
            type="number"
            step="any"
            placeholder="14.2273"
            error={!!errors.lat}
          />
        </Field>
        <Field label="Longitude" error={errors.lng?.message}>
          <Input
            {...register("lng")}
            type="number"
            step="any"
            placeholder="120.9741"
            error={!!errors.lng}
          />
        </Field>
      </div>

      <hr className="border-border" />

      {/* Submitter info */}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        About you (optional)
      </p>

      <Field label="Your name (optional)" error={errors.submitter_name?.message}>
        <Input
          {...register("submitter_name")}
          placeholder="Juan dela Cruz"
          error={!!errors.submitter_name}
        />
      </Field>

      <Field label="Your email (optional)" error={errors.submitter_email?.message}>
        <Input
          {...register("submitter_email")}
          type="email"
          placeholder="juan@example.com"
          error={!!errors.submitter_email}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-navy py-3 text-sm font-bold text-white shadow-card
                   transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Input({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none",
        "focus:border-navy focus:ring-1 focus:ring-navy placeholder:text-muted-foreground/60",
        error && "border-destructive",
        className,
      )}
    />
  );
}