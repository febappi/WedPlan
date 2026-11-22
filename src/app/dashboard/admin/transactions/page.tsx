import type { Metadata } from "next";
import StatusBadge from "@/components/services/StatusBadge";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ListFilters from "@/components/dashboard/ListFilters";
import ListPagination from "@/components/dashboard/ListPagination";
import { formatDate, formatMoney } from "@/lib/format";
import { serverFetch } from "@/lib/server-api";
import { Paginated, Transaction } from "@/lib/types";

export const metadata: Metadata = {
  title: "Transactions",
};

const getText = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

const TransactionsPage = async ({ searchParams }: PageProps<"/dashboard/admin/transactions">) => {
  const params = await searchParams;
  const values = { status: getText(params.status), page: getText(params.page) };
  const query = new URLSearchParams(Object.entries(values).filter(([, value]) => value));
  const data = await serverFetch<Paginated<"transactions", Transaction>>(`/payments/transactions?${query.toString()}`);

  return (
    <>
      <DashboardHeader
        title="Transactions"
        description="Premium payments from Stripe. Records are read only: a payment is marked paid only when Stripe confirms it."
      />
      <ListFilters
        basePath="/dashboard/admin/transactions"
        values={values}
        selects={[
          {
            name: "status",
            label: "Payment status",
            options: [
              { value: "", label: "All payments" },
              { value: "paid", label: "Paid" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
              { value: "cancelled", label: "Cancelled" },
            ],
          },
        ]}
      />

      {!data && <p className="stock p-(--space-xl) text-ink-2">Transactions could not load. Please refresh the page.</p>}
      {data && data.transactions.length === 0 && <p className="stock p-(--space-xl) text-ink-2">No transactions match this filter.</p>}
      {data && data.transactions.length > 0 && (
        <>
          <div className="stock overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-rule text-ink-3">
                <tr>
                  <th scope="col" className="px-(--space-lg) py-(--space-sm) font-medium">Vendor</th>
                  <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Plan</th>
                  <th scope="col" className="px-(--space-sm) py-(--space-sm) text-right font-medium">Amount</th>
                  <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Status</th>
                  <th scope="col" className="px-(--space-lg) py-(--space-sm) font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-rule last:border-b-0">
                    <td className="px-(--space-lg) py-(--space-sm)">
                      <p className="font-semibold text-ink">{transaction.vendor?.businessName || transaction.vendor?.name || "Deleted vendor"}</p>
                      {transaction.vendor?.email && <p className="text-ink-3">{transaction.vendor.email}</p>}
                    </td>
                    <td className="px-(--space-sm) py-(--space-sm) text-ink capitalize">{transaction.plan}</td>
                    <td className="px-(--space-sm) py-(--space-sm) text-right font-semibold tabular-nums text-ink">
                      {formatMoney(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-(--space-sm) py-(--space-sm)">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-(--space-lg) py-(--space-sm) whitespace-nowrap text-ink-2">{formatDate(transaction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ListPagination
            basePath="/dashboard/admin/transactions"
            values={values}
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
          />
        </>
      )}
    </>
  );
};

export default TransactionsPage;
