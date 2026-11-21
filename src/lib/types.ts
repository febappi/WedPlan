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
  isPremium?: boolean;
};

export type VendorInfo = {
  _id: string;
  name: string;
  email?: string;
  image?: string | null;
  businessName?: string | null;
  isPremium?: boolean;
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
  updatedAt?: string;
  vendor?: VendorInfo;
  isBookable?: boolean;
};

export type MyServicesResponse = {
  services: Service[];
  activeCount: number;
  activeLimit: number | null;
};

export type ServiceInput = {
  serviceName: string;
  category: Category;
  description: string;
  price: number;
  location: string;
  images: string[];
};

export type ServiceFilterValues = {
  search: string;
  category: string;
  location: string;
  sort: string;
  page: string;
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
  respondedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  service?: Pick<Service, "_id" | "serviceName" | "images" | "category" | "price" | "location">;
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

export type PremiumPlan = {
  name: string;
  amount: number;
  currency: string;
  interval: string;
};

export type SubscriptionInfo = {
  isPremium: boolean;
  subscriptionExpiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  canCancel: boolean;
};
