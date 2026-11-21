import { BookingStatus } from "./types";

export const bookingStatuses: BookingStatus[] = ["pending", "accepted", "rejected", "cancelled"];

export const getStatusFilter = (value: string | string[] | undefined) =>
  typeof value === "string" && bookingStatuses.includes(value as BookingStatus) ? (value as BookingStatus) : "";
