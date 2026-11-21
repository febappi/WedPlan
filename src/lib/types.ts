export type Role = "admin" | "vendor" | "customer";

export type SubscriptionPlan = "free" | "premium";

export type Category =
  | "Photography & Videography"
  | "Wedding Venues"
  | "Decoration & Florist"
  | "Catering Services"
  | "Makeup & Styling"
  | "Wedding Fashion";

export type ServiceStatus = "pending" | "approved" | "rejected";

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  isBlocked?: boolean;
  businessName?: string | null;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionExpiresAt?: string | Date | null;
};

export type VendorInfo = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  businessName?: string | null;
  subscriptionPlan?: SubscriptionPlan;
};

export type Service = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: Category;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  createdAt: string;
  vendor?: VendorInfo;
};

export type ServicesResponse = {
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
};

export type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  service?: Pick<Service, "_id" | "serviceName" | "images" | "category" | "price">;
  vendor?: VendorInfo;
  customer?: Pick<VendorInfo, "_id" | "name" | "email" | "image">;
};

export type Transaction = {
  _id: string;
  vendorId: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string | null;
  status: PaymentStatus;
  createdAt: string;
  vendor?: VendorInfo;
};
