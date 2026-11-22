import { getCategoryDetail } from "@/lib/categories";
import { Category } from "@/lib/types";

// The category name on its own tile colour, the same colours as the home page tiles
const CategoryChip = ({ category }: { category: Category }) => {
  const detail = getCategoryDetail(category);

  return (
    <span
      className="inline-block max-w-full min-w-0 truncate rounded-(--radius-pill) px-(--space-sm) py-(--space-3xs) text-xs font-semibold whitespace-nowrap"
      style={{ background: detail.tile, color: detail.tileInk }}
    >
      {category}
    </span>
  );
};

export default CategoryChip;
