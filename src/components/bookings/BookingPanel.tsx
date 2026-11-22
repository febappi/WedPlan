import BookingDialog from "./BookingDialog";
import { Service, SessionUser } from "@/lib/types";

// Who may book: only customers, only on approved and available services
const BookingPanel = ({ service, user }: { service: Service; user: SessionUser }) => {
  const vendorName = service.vendor?.businessName || service.vendor?.name || "the vendor";
  const isOwner = user.id === String(service.vendorId);

  let note = "";
  if (user.role === "admin") {
    note = "Admins cannot send booking requests. Sign in with a customer account to book.";
  } else if (isOwner) {
    note = "This is your service. Requests from couples appear in your Booking Requests.";
  } else if (user.role === "vendor") {
    note = "Vendor accounts cannot book services. Sign in with a customer account to book.";
  } else if (!service.isBookable) {
    note = "This service is not taking booking requests right now.";
  }

  return (
    <div className="stock mt-(--space-lg) p-(--space-md) sm:p-(--space-lg)">
      <h2 className="text-(length:--text-title)">Book this service</h2>
      <p className="mt-(--space-2xs) text-sm text-ink-2">Send the date and place. Nothing is charged on WedPlan.</p>
      <div className="mt-(--space-md)">
        {note ? (
          <p className="rounded-(--radius-input) bg-paper-2 px-(--space-md) py-(--space-sm) text-sm text-ink-2">{note}</p>
        ) : (
          <BookingDialog serviceId={service._id} serviceName={service.serviceName} vendorName={vendorName} user={user} />
        )}
      </div>
    </div>
  );
};

export default BookingPanel;
