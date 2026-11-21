import { ServiceFilterValues } from "./types";

export const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export const getFilterQuery = (filters: Partial<ServiceFilterValues>) => {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });
  return query;
};

export const getServicesLink = (filters: Partial<ServiceFilterValues>) => {
  const queryString = getFilterQuery(filters).toString();
  return queryString ? `/services?${queryString}` : "/services";
};

export const getServiceLink = (id: string) => `/services/${id}`;
