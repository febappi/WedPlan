"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleButton from "./GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient, clearSignupRole, setSignupRole } from "@/lib/auth-client";
import { getImageError, uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

type SignupRole = "customer" | "vendor";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  businessName?: string;
};

const roleOptions: { value: SignupRole; title: string; text: string }[] = [
  { value: "customer", title: "Customer", text: "I am planning a wedding" },
  { value: "vendor", title: "Vendor", text: "I offer wedding services" },
];

export const getPasswordError = (password: string) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must have at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must have at least one lowercase letter";
  }
  return "";
};

const SignUpForm = ({ defaultRole }: { defaultRole: SignupRole }) => {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    if (!file) {
      setImageFile(null);
      setPreview("");
      return;
    }
    const imageError = getImageError(file);
    setErrors((prev) => ({ ...prev, image: imageError || undefined }));
    if (imageError) {
      e.target.value = "";
      setImageFile(null);
      setPreview("");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    const businessName = String(formData.get("businessName") || "").trim();

    const newErrors: FormErrors = {};
    if (!name) {
      newErrors.name = "Full name is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    const passwordError = getPasswordError(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    if (role === "vendor" && !businessName) {
      newErrors.businessName = "Business name is required for vendors";
    }
    if (errors.image) {
      newErrors.image = errors.image;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setLoading(true);
    setSignupRole(role);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      businessName: role === "vendor" ? businessName : undefined,
    });
    clearSignupRole();

    if (error) {
      setLoading(false);
      toast.add({ title: error.message || "Sign up failed. Please try again.", type: "error" });
      return;
    }

    // The account exists now, so the image upload is allowed
    if (imageFile) {
      try {
        const image = await uploadImage(imageFile);
        await authClient.updateUser({ image });
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : "Image upload failed";
        toast.add({ title: `${message}. You can add a photo later in Profile Settings.`, type: "warning" });
      }
    }

    toast.add({ title: "Account created. Welcome to WedPlan.", type: "success" });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div>
      <form onSubmit={handleSignUp} method="post" noValidate className="space-y-(--space-lg)">
        <fieldset>
          <legend className="text-sm text-ink-2">Account role</legend>
          <div className="mt-(--space-xs) grid grid-cols-1 gap-(--space-sm) sm:grid-cols-2">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-(--space-2xs) rounded-(--radius-stock) border px-(--space-md) py-(--space-sm) transition-colors duration-(--dur-short) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
                  role === option.value ? "border-ink bg-pear/40 shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-rule bg-card hover:border-ink-3"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="sr-only"
                />
                <span className="font-semibold text-ink">{option.title}</span>
                <span className="text-sm text-ink-3">{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-(--space-xs)">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {role === "vendor" && (
          <div className="space-y-(--space-xs)">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              name="businessName"
              autoComplete="organization"
              placeholder="The name couples will see"
              aria-invalid={Boolean(errors.businessName)}
            />
            {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
          </div>
        )}

        <div className="space-y-(--space-xs)">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-(--space-xs)">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password}</p>
          ) : (
            <p className="text-sm text-ink-3">At least 6 characters, with one uppercase and one lowercase letter</p>
          )}
        </div>

        <div className="space-y-(--space-xs)">
          <Label htmlFor="image">Profile photo (optional)</Label>
          <div className="flex items-center gap-(--space-md)">
            {preview && (
              <Image src={preview} alt="" width={48} height={48} unoptimized className="size-12 shrink-0 rounded-full object-cover" />
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              aria-invalid={Boolean(errors.image)}
              className="pt-1.5"
            />
          </div>
          {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Creating your account" : "Sign Up"}
        </Button>
      </form>

      <div className="my-(--space-lg) flex items-center gap-(--space-sm) text-sm text-ink-3">
        <span className="h-px flex-1 bg-rule" />
        or
        <span className="h-px flex-1 bg-rule" />
      </div>

      <GoogleButton callbackURL="/dashboard" errorCallbackURL="/signup" label="Sign up with Google" role={role} />

      <p className="mt-(--space-lg) text-sm text-ink-2">
        Already have an account?{" "}
        <Link href="/signin" className="text-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
