import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VendorInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

// Vendor photo, business name and the Premium mark when the vendor has an active plan
const VendorLine = ({ vendor, className }: { vendor?: VendorInfo; className?: string }) => {
  const displayName = vendor?.businessName || vendor?.name || "WedPlan vendor";

  return (
    <div className={cn("flex min-w-0 items-center gap-(--space-xs)", className)}>
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={vendor?.image || undefined} alt="" />
        <AvatarFallback className="bg-ink text-xs text-paper">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
        {vendor?.isPremium && (
          <p className="flex items-center gap-(--space-3xs) text-xs text-blue">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            Premium vendor
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorLine;
