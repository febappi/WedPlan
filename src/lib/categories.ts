import { Category } from "./types";

export const categories: Category[] = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export type CategoryDetail = {
  name: Category;
  short: string;
  description: string;
  stain: string;
};

export const categoryDetails: CategoryDetail[] = [
  {
    name: "Photography & Videography",
    short: "Photo and film",
    description: "Photographers and film crews for the ceremony, the reception and the portraits before.",
    stain: "var(--stain-4)",
  },
  {
    name: "Wedding Venues",
    short: "Venues",
    description: "Halls, gardens, rooftops and community centres, asked for the date you give.",
    stain: "var(--stain-2)",
  },
  {
    name: "Decoration & Florist",
    short: "Flowers",
    description: "Stage decoration, gate and aisle work, bouquets and table flowers.",
    stain: "var(--stain-1)",
  },
  {
    name: "Catering Services",
    short: "Catering",
    description: "Set menus, buffets and dessert tables for every event of the wedding.",
    stain: "var(--stain-3)",
  },
  {
    name: "Makeup & Styling",
    short: "Makeup",
    description: "Bridal makeup, hair, mehndi and styling for the couple and the family.",
    stain: "var(--stain-5)",
  },
  {
    name: "Wedding Fashion",
    short: "Fashion",
    description: "Bridal wear, sherwanis, suits and tailoring for the main day and the events around it.",
    stain: "var(--stain-6)",
  },
];

export const getCategoryLink = (category: Category) => `/services?category=${encodeURIComponent(category)}`;
