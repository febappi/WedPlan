"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { categories } from "@/lib/categories";
import { getServicesLink, sortOptions } from "@/lib/services";
import { ServiceFilterValues } from "@/lib/types";

type ServiceFiltersProps = {
  filters: ServiceFilterValues;
  locations: string[];
};

const ServiceFilters = ({ filters, locations }: ServiceFiltersProps) => {
  const router = useRouter();
  const [search, setSearch] = useState(filters.search);
  const [isPending, startTransition] = useTransition();
  const hasFilters = Boolean(filters.search || filters.category || filters.location || filters.sort);

  // Every change starts again from page one
  const applyFilters = (changes: Partial<ServiceFilterValues>) => {
    startTransition(() => {
      router.push(getServicesLink({ ...filters, ...changes, page: "" }), { scroll: false });
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters({ search: search.trim() });
  };

  return (
    <div className="stock p-(--space-md) sm:p-(--space-lg)">
      <form onSubmit={handleSearch} role="search" className="flex gap-(--space-xs) sm:gap-(--space-sm)">
        <Label htmlFor="service-search" className="sr-only">
          Search services
        </Label>
        <Input
          id="service-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services"
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={isPending} aria-label="Search" className="shrink-0">
          {isPending ? <Spinner /> : <Search />}
          <span className="max-sm:sr-only">Search</span>
        </Button>
      </form>

      <div className="mt-(--space-md) grid grid-cols-2 gap-x-(--space-sm) gap-y-(--space-md) sm:grid-cols-3 sm:gap-(--space-md)">
        <div className="space-y-(--space-xs)">
          <Label htmlFor="filter-category">Category</Label>
          <NativeSelect
            id="filter-category"
            value={filters.category}
            onChange={(e) => applyFilters({ category: e.target.value })}
            className="w-full"
          >
            <NativeSelectOption value="">All</NativeSelectOption>
            {categories.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {category}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-(--space-xs)">
          <Label htmlFor="filter-location">Location</Label>
          <NativeSelect
            id="filter-location"
            value={filters.location}
            onChange={(e) => applyFilters({ location: e.target.value })}
            className="w-full"
          >
            <NativeSelectOption value="">All</NativeSelectOption>
            {locations.map((location) => (
              <NativeSelectOption key={location} value={location}>
                {location}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="col-span-2 space-y-(--space-xs) sm:col-span-1">
          <Label htmlFor="filter-sort">Sort by</Label>
          <NativeSelect
            id="filter-sort"
            value={filters.sort || "newest"}
            onChange={(e) => applyFilters({ sort: e.target.value === "newest" ? "" : e.target.value })}
            className="w-full"
          >
            {sortOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      {hasFilters && (
        <Link href="/services" onClick={() => setSearch("")} className="text-link mt-(--space-md) inline-block text-sm">
          Clear all filters
        </Link>
      )}
    </div>
  );
};

export default ServiceFilters;
