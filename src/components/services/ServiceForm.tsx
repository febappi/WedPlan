"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { categories } from "@/lib/categories";
import { Category, Service, ServiceInput } from "@/lib/types";

type FormErrors = Partial<Record<keyof ServiceInput, string>>;

const validate = (values: ServiceInput): FormErrors => {
  const errors: FormErrors = {};
  if (values.serviceName.length < 3) {
    errors.serviceName = "Service name must be at least 3 characters";
  }
  if (!categories.includes(values.category)) {
    errors.category = "Please choose a category";
  }
  if (values.description.length < 20) {
    errors.description = "Describe the service in at least 20 characters";
  }
  if (!Number.isFinite(values.price) || values.price <= 0) {
    errors.price = "Price must be a positive number";
  }
  if (!values.location) {
    errors.location = "Location is required";
  }
  if (values.images.length === 0) {
    errors.images = "Add at least one photo";
  }
  return errors;
};

const ServiceForm = ({ service }: { service?: Service }) => {
  const router = useRouter();
  const isEdit = Boolean(service);
  const [images, setImages] = useState<string[]>(service?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [planLimit, setPlanLimit] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: ServiceInput = {
      serviceName: String(formData.get("serviceName")).trim(),
      category: String(formData.get("category")) as Category,
      description: String(formData.get("description")).trim(),
      price: Number(formData.get("price")),
      location: String(formData.get("location")).trim(),
      images,
    };

    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setSaving(true);
    setPlanLimit("");
    try {
      const data = await apiFetch(isEdit ? `/services/${service?._id}` : "/services", {
        method: isEdit ? "PATCH" : "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(values),
      });
      toast.add({ title: data.message, type: "success" });
      router.push("/dashboard/vendor/services");
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Could not save the service";
      if (message.includes("free plan")) {
        setPlanLimit(message);
      }
      toast.add({ title: message, type: "error" });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-3xl space-y-(--space-lg)">
      {planLimit && (
        <div role="alert" className="stock flex flex-col gap-(--space-sm) p-(--space-lg) sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink">{planLimit}</p>
          <Link href="/dashboard/vendor/subscription" className={buttonVariants({ size: "sm" })}>
            See Premium
          </Link>
        </div>
      )}

      <div className="space-y-(--space-xs)">
        <Label htmlFor="serviceName">Service name</Label>
        <Input
          id="serviceName"
          name="serviceName"
          defaultValue={service?.serviceName}
          placeholder="For example: Full day wedding photography"
          aria-invalid={Boolean(errors.serviceName)}
        />
        {errors.serviceName && <p className="text-sm text-destructive">{errors.serviceName}</p>}
      </div>

      <div className="grid grid-cols-1 gap-(--space-lg) sm:grid-cols-2">
        <div className="space-y-(--space-xs)">
          <Label htmlFor="category">Category</Label>
          <NativeSelect id="category" name="category" defaultValue={service?.category || ""} aria-invalid={Boolean(errors.category)} className="w-full">
            <NativeSelectOption value="" disabled>
              Choose a category
            </NativeSelectOption>
            {categories.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {category}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>
        <div className="space-y-(--space-xs)">
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            defaultValue={service?.price}
            placeholder="25000"
            aria-invalid={Boolean(errors.price)}
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
        </div>
      </div>

      <div className="space-y-(--space-xs)">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={service?.location}
          placeholder="City where you offer it, for example Dhaka"
          autoComplete="address-level2"
          aria-invalid={Boolean(errors.location)}
        />
        {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
      </div>

      <div className="space-y-(--space-xs)">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={service?.description}
          placeholder="What is included, how long it runs, what couples should know"
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <fieldset className="space-y-(--space-xs)">
        <legend className="text-sm font-medium text-ink-2">Photos</legend>
        <ImageUploader images={images} onChange={setImages} invalid={Boolean(errors.images)} onUploadingChange={setUploading} />
        {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
      </fieldset>

      {isEdit && (
        <p className="text-sm text-ink-3">Saving changes sends the service back to the admin for approval before customers see it again.</p>
      )}

      <div className="flex flex-wrap gap-(--space-sm)">
        <Button type="submit" size="lg" disabled={saving || uploading}>
          {saving && <Spinner />}
          {saving ? "Saving" : uploading ? "Waiting for photos" : isEdit ? "Save changes" : "Submit for approval"}
        </Button>
        <Link href="/dashboard/vendor/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default ServiceForm;
