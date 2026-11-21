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
  // the tile colour, its pressed edge and the type colour on it
  tile: string;
  tileDeep: string;
  tileInk: string;
};

export const categoryDetails: CategoryDetail[] = [
  {
    name: "Photography & Videography",
    short: "Photo and film",
    description: "Photographers and film crews for the ceremony, the reception and the portraits before.",
    tile: "var(--color-blue)",
    tileDeep: "var(--color-blue-deep)",
    tileInk: "var(--color-paper)",
  },
  {
    name: "Wedding Venues",
    short: "Venues",
    description: "Halls, gardens, rooftops and community centres, asked for the date you give.",
    tile: "var(--color-mint)",
    tileDeep: "var(--color-mint-deep)",
    tileInk: "var(--color-ink)",
  },
  {
    name: "Decoration & Florist",
    short: "Flowers",
    description: "Stage decoration, gate and aisle work, bouquets and table flowers.",
    tile: "var(--color-coral)",
    tileDeep: "var(--color-coral-deep)",
    tileInk: "var(--color-ink)",
  },
  {
    name: "Catering Services",
    short: "Catering",
    description: "Set menus, buffets and dessert tables for every event of the wedding.",
    tile: "var(--color-pear)",
    tileDeep: "var(--color-pear-deep)",
    tileInk: "var(--color-ink)",
  },
  {
    name: "Makeup & Styling",
    short: "Makeup",
    description: "Bridal makeup, hair, mehndi and styling for the couple and the family.",
    tile: "var(--color-sugar)",
    tileDeep: "var(--color-sugar-deep)",
    tileInk: "var(--color-ink)",
  },
  {
    name: "Wedding Fashion",
    short: "Fashion",
    description: "Bridal wear, sherwanis, suits and tailoring for the main day and the events around it.",
    tile: "var(--color-sand)",
    tileDeep: "var(--color-kraft)",
    tileInk: "var(--color-ink)",
  },
];

export const getCategoryLink = (category: Category) => `/services?category=${encodeURIComponent(category)}`;
export const getCategoryDetail = (category: Category) => categoryDetails.find((item) => item.name === category) ?? categoryDetails[0];
