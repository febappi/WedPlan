// Service prices are in Bangladeshi taka
export const formatPrice = (price: number) => `৳${Math.round(price).toLocaleString("en-IN")}`;

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
