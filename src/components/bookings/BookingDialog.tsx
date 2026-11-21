"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { SessionUser } from "@/lib/types";

type BookingDialogProps = {
  serviceId: string;
  serviceName: string;
  vendorName: string;
  user: SessionUser;
};

type FormErrors = { eventDate?: string; eventLocation?: string; message?: string };

// Today in the visitor's own time zone, as YYYY-MM-DD for the date input
const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const BookingDialog = ({ serviceId, serviceName, vendorName, user }: BookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const today = getToday();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const eventDate = String(formData.get("eventDate"));
    const eventLocation = String(formData.get("eventLocation")).trim();
    const message = String(formData.get("message")).trim();

    const newErrors: FormErrors = {};
    if (!eventDate) {
      newErrors.eventDate = "Choose the event date";
    } else if (eventDate < today) {
      newErrors.eventDate = "The event date cannot be in the past";
    }
    if (!eventLocation) {
      newErrors.eventLocation = "Where is the event?";
    }
    if (message.length > 1000) {
      newErrors.message = "Keep the message under 1000 characters";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSending(true);
    try {
      const data = await apiFetch("/bookings", {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ serviceId, eventDate, eventLocation, message }),
      });
      toast.add({ title: data.message, type: "success" });
      setSent(true);
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "The booking request was not sent", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSent(false);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" className="w-full" />}>
        <CalendarCheck />
        Request a booking
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{sent ? "Request sent" : "Request a booking"}</DialogTitle>
          <DialogDescription>
            {sent ? `${vendorName} will accept or decline it from their dashboard.` : `${serviceName} from ${vendorName}`}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-wrap gap-(--space-sm)">
            <Link href="/dashboard/customer/bookings" className={buttonVariants()}>
              See my bookings
            </Link>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-(--space-md)">
            <p className="rounded-(--radius-input) bg-paper-2 px-(--space-sm) py-(--space-xs) text-sm text-ink-2">
              Booking as <span className="font-semibold text-ink">{user.name}</span> ({user.email})
            </p>
            <div className="space-y-(--space-xs)">
              <Label htmlFor="eventDate">Event date</Label>
              <Input id="eventDate" name="eventDate" type="date" min={today} aria-invalid={Boolean(errors.eventDate)} />
              {errors.eventDate && <p className="text-sm text-destructive">{errors.eventDate}</p>}
            </div>
            <div className="space-y-(--space-xs)">
              <Label htmlFor="eventLocation">Event location</Label>
              <Input
                id="eventLocation"
                name="eventLocation"
                placeholder="Venue name and city"
                maxLength={200}
                aria-invalid={Boolean(errors.eventLocation)}
              />
              {errors.eventLocation && <p className="text-sm text-destructive">{errors.eventLocation}</p>}
            </div>
            <div className="space-y-(--space-xs)">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                maxLength={1000}
                placeholder="Guest count, timings, anything the vendor should know"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={sending}>
              {sending && <Spinner />}
              {sending ? "Sending request" : "Send booking request"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
