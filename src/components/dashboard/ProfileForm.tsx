"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/shared/UserMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { getImageError, uploadImage } from "@/lib/upload";
import { SessionUser } from "@/lib/types";

const roleLabels = { admin: "Admin", vendor: "Vendor", customer: "Customer" };

const ProfileForm = ({ user }: { user: SessionUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState<{ name?: string; image?: string; businessName?: string; phone?: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    const imageError = file ? getImageError(file) : "";
    setErrors((prev) => ({ ...prev, image: imageError || undefined }));
    if (!file || imageError) {
      e.target.value = "";
      setImageFile(null);
      setPreview("");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name")).trim();
    const businessName = String(formData.get("businessName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    const newErrors: typeof errors = {};
    if (!name) {
      newErrors.name = "Name is required";
    }
    if (user.role === "vendor" && !businessName) {
      newErrors.businessName = "Business name is required for vendors";
    }
    if (phone && !/^\+?[0-9 ()-]{7,20}$/.test(phone)) {
      newErrors.phone = "Enter a valid phone number, for example +8801712345678";
    }
    if (errors.image) {
      newErrors.image = errors.image;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const image = imageFile ? await uploadImage(imageFile) : undefined;
      // Role and subscription are not accepted by this endpoint, so they cannot be changed here
      const { error } = await authClient.updateUser({
        name,
        phone,
        ...(image ? { image } : {}),
        ...(user.role === "vendor" ? { businessName } : {}),
      });
      if (error) {
        throw new Error(error.message || "Profile update failed");
      }
      toast.add({ title: "Profile updated", type: "success" });
      setImageFile(null);
      setPreview("");
      router.refresh();
    } catch (submitError) {
      toast.add({ title: submitError instanceof Error ? submitError.message : "Profile update failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-(--space-lg)">
      <div className="flex items-center gap-(--space-md)">
        {preview ? (
          <Image src={preview} alt="" width={64} height={64} unoptimized className="size-16 rounded-full object-cover" />
        ) : (
          <UserAvatar user={user} className="size-16" />
        )}
        <div className="min-w-0 flex-1 space-y-(--space-xs)">
          <Label htmlFor="image">Profile photo</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            aria-invalid={Boolean(errors.image)}
            className="pt-1.5"
          />
          {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
        </div>
      </div>

      <div className="space-y-(--space-xs)">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={user.name} autoComplete="name" aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {user.role === "vendor" && (
        <div className="space-y-(--space-xs)">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            name="businessName"
            defaultValue={user.businessName || ""}
            autoComplete="organization"
            aria-invalid={Boolean(errors.businessName)}
          />
          {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
        </div>
      )}

      <div className="space-y-(--space-xs)">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={user.phone || ""}
          placeholder="+8801712345678"
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <dl className="grid grid-cols-1 gap-(--space-md) border-t border-rule pt-(--space-lg) sm:grid-cols-3">
        <div>
          <dt className="text-sm text-ink-3">Email</dt>
          <dd className="m-0 mt-(--space-2xs) truncate text-ink">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-3">Account role</dt>
          <dd className="m-0 mt-(--space-2xs) text-ink">{roleLabels[user.role]}</dd>
        </div>
        {user.role === "vendor" && (
          <div>
            <dt className="text-sm text-ink-3">Plan</dt>
            <dd className="m-0 mt-(--space-2xs) text-ink">{user.subscriptionPlan === "premium" ? "Premium" : "Free"}</dd>
          </div>
        )}
      </dl>

      <Button type="submit" disabled={loading}>
        {loading && <Spinner />}
        {loading ? "Saving" : "Save changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
