// Service prices are in Bangladeshi taka
export const formatPrice = (price: number) => `৳${Math.round(price).toLocaleString("en-IN")}`;

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Event dates are stored as midnight UTC of the chosen day, so they are read back in UTC
export const formatEventDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
