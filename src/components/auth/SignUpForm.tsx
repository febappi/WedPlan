"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleButton from "./GoogleButton";
import PasswordChecklist from "./PasswordChecklist";
import RolePicker, { SignupRole } from "./RolePicker";
import { Button } from "@/components/ui/button";
import { FileField } from "@/components/ui/file-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient, clearSignupRole, setSignupRole } from "@/lib/auth-client";
import { getImageError, uploadImage } from "@/lib/upload";
import { getEmailError, getPasswordError } from "@/lib/validation";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  businessName?: string;
};

const SignUpForm = ({ defaultRole, googleError }: { defaultRole: SignupRole; googleError: string }) => {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  // Email is checked once the field is left, then live while typing; the password list updates on every key
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  const emailError = touched.email || submitted ? getEmailError(email) : "";
  const passwordInvalid = (touched.password || submitted) && Boolean(getPasswordError(password));

  // Clears a field's submit error as soon as the user fixes it
  const clearError = (field: keyof FormErrors, valid: boolean) => {
    if (errors[field] && valid) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
    const businessName = String(formData.get("businessName") || "").trim();
    setSubmitted(true);

    const newErrors: FormErrors = {};
    if (!name) {
      newErrors.name = "Full name is required";
    }
    const emailProblem = getEmailError(email);
    if (emailProblem) {
      newErrors.email = emailProblem;
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
      // Focus the first problem in the order the fields appear on screen
      const firstInvalid = (["name", "businessName", "email", "password", "image"] as const).find((field) => newErrors[field]);
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

    setLoading(true);
    setSignupRole(role);
    const { error } = await authClient.signUp.email({
      name,
      email: email.trim(),
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
      {googleError && (
        <p role="alert" className="mb-(--space-lg) rounded-(--radius-input) border border-destructive/40 px-(--space-sm) py-(--space-xs) text-sm text-destructive">
          {googleError}
        </p>
      )}

      <form onSubmit={handleSignUp} method="post" noValidate className="space-y-(--space-lg)">
        <RolePicker role={role} onChange={setRole} />

        <div className="space-y-(--space-xs)">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(e) => clearError("name", e.target.value.trim() !== "")}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          )}
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
              aria-describedby={errors.businessName ? "businessName-error" : undefined}
              onChange={(e) => clearError("businessName", e.target.value.trim() !== "")}
            />
            {errors.businessName && (
              <p id="businessName-error" className="text-sm text-destructive">
                {errors.businessName}
              </p>
            )}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <p id="email-error" role="alert" className="text-sm text-destructive">
              {emailError}
            </p>
          )}
        </div>

        <div className="space-y-(--space-xs)">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            aria-invalid={passwordInvalid}
            aria-describedby="password-rules"
          />
          <PasswordChecklist id="password-rules" password={password} showErrors={passwordInvalid} />
        </div>

        <div className="space-y-(--space-xs)">
          <Label htmlFor="image">Profile photo (optional)</Label>
          <div className="flex items-center gap-(--space-md)">
            {preview && (
              <Image src={preview} alt="" width={48} height={48} unoptimized className="size-12 shrink-0 rounded-full object-cover" />
            )}
            <FileField
              id="image"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              aria-invalid={Boolean(errors.image)}
              className="flex-1"
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

      <GoogleButton callbackURL="/dashboard" errorCallbackURL={`/signup?role=${role}`} label="Sign up with Google" />
      <p className="mt-(--space-xs) text-center text-sm text-ink-3">New to WedPlan? You choose Customer or Vendor right after Google.</p>

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
