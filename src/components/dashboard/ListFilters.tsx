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

type SelectFilter = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
};

type ListFiltersProps = {
  basePath: string;
  values: Record<string, string>;
  searchPlaceholder: string;
  selects: SelectFilter[];
};

// Search and dropdown filters for admin tables, kept in the URL so refresh and back work
const ListFilters = ({ basePath, values, searchPlaceholder, selects }: ListFiltersProps) => {
  const router = useRouter();
  const [search, setSearch] = useState(values.search || "");
  const [isPending, startTransition] = useTransition();
  const hasFilters = Object.entries(values).some(([key, value]) => key !== "page" && value);

  const apply = (changes: Record<string, string>) => {
    const query = new URLSearchParams();
    Object.entries({ ...values, ...changes, page: "" }).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });
    const queryString = query.toString();
    startTransition(() => router.push(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false }));
  };

  return (
    <div className="mb-(--space-lg) flex flex-col gap-(--space-sm) lg:flex-row lg:items-end">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          apply({ search: search.trim() });
        }}
        className="flex flex-1 gap-(--space-xs)"
      >
        <Label htmlFor="list-search" className="sr-only">
          Search
        </Label>
        <Input id="list-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={searchPlaceholder} />
        <Button type="submit" variant="outline" disabled={isPending} aria-label="Search">
          {isPending ? <Spinner /> : <Search />}
        </Button>
      </form>

      {selects.map((select) => (
        <div key={select.name} className="space-y-(--space-2xs) lg:w-52">
          <Label htmlFor={`filter-${select.name}`}>{select.label}</Label>
          <NativeSelect
            id={`filter-${select.name}`}
            value={values[select.name] || ""}
            onChange={(e) => apply({ [select.name]: e.target.value })}
            className="w-full"
          >
            {select.options.map((option) => (
              <NativeSelectOption key={option.value || "all"} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      ))}

      {hasFilters && (
        <Link href={basePath} onClick={() => setSearch("")} className="text-link text-sm lg:pb-(--space-sm)">
          Clear
        </Link>
      )}
    </div>
  );
};

export default ListFilters;
