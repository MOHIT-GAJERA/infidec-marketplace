import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { orders } from "@/lib/db";
import { OrderCard } from "@/components/account/OrderCard";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({ searchParams }: PageProps<"/order-success">) {
  const user = await currentUser();
  if (!user) redirect("/?auth=login&next=%2Faccount");
  const { id } = await searchParams;
  const order = typeof id === "string" ? await orders.findForUser(id, user.id) : undefined;
  if (!order) redirect("/account");

  return (
    <section className="bg-soft py-12 lg:py-16">
      <div className="container-x max-w-3xl">
        <div className="rounded-2xl border border-line bg-white p-6 text-center sm:p-10">
          <CircleCheck aria-hidden="true" className="mx-auto size-16 text-brand-600" strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-semibold text-ink sm:text-3xl">Thank you, {user.firstName}! Your order is confirmed.</h1>
          <p className="mt-3 text-base leading-7 text-body">
            A confirmation has been recorded for <strong className="font-semibold text-ink">{order.billing.email}</strong>. Your
            download links and licence keys are available in your account.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/account#orders" className="btn-primary">
              View My Orders
            </Link>
            <Link href="/products" className="btn-outline px-5 py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <OrderCard order={order} headingLevel="h2" />
        </div>
      </div>
    </section>
  );
}
