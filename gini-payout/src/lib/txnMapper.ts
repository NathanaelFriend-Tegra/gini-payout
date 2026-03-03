import type { Transaction } from "@/lib/mockData";
import type { OmneaTxn } from "@/lib/api";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(amount);
}

export function mapApiTxnToUi(t: OmneaTxn): Transaction {
  // If amount sometimes comes as a string, handle both:
  const rawAmount =
    typeof t.amount === "number"
      ? t.amount
      : typeof (t as any).amount === "string"
        ? Number((t as any).amount)
        : 0;

  const amount = Number.isFinite(rawAmount) ? rawAmount : 0;

  const currency = (t as any).currency ?? "ZAR";

  const direction: Transaction["direction"] = amount >= 0 ? "credit" : "debit";

  const createdAt =
    (t as any).createdAt ??
    (t as any).date ??
    (t as any).timestamp ??
    new Date().toISOString();

  const description =
    (t as any).description ??
    (t as any).merchant ??
    (t as any).reference ??
    "Transaction";

  return {
    id: (t as any).id ?? (t as any).reference ?? crypto.randomUUID(),
    amount,
    direction,
    status: "pending", // matches your type in the screenshot
    type: "eft",       // matches your type in the screenshot
    amountFormatted: formatMoney(Math.abs(amount), currency),
    description,
    createdAt,
  };
}
