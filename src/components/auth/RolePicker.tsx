import { cn } from "@/lib/utils";

export type SignupRole = "customer" | "vendor";

const roleOptions: { value: SignupRole; title: string; text: string }[] = [
  { value: "customer", title: "Customer", text: "I am planning a wedding" },
  { value: "vendor", title: "Vendor", text: "I offer wedding services" },
];

type RolePickerProps = {
  role: SignupRole;
  onChange: (role: SignupRole) => void;
  legend?: string;
};

// The two account types as large radio cards, shared by email sign up and the Google welcome step
const RolePicker = ({ role, onChange, legend = "Account role" }: RolePickerProps) => {
  return (
    <fieldset>
      <legend className="text-sm text-ink-2">{legend}</legend>
      <div className="mt-(--space-xs) grid grid-cols-1 gap-(--space-sm) min-[360px]:grid-cols-2">
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
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className="font-semibold text-ink">{option.title}</span>
            <span className="text-sm text-ink-3">{option.text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default RolePicker;
