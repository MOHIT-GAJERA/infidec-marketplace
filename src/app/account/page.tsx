import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { orders } from "@/lib/db";
import { PageHeader } from "@/components/PageHeader";
import { OrderCard, formatDate } from "@/components/account/OrderCard";
import { LogoutButton } from "@/components/account/LogoutButton";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/?auth=login&next=%2Faccount");
  const list = await orders.listByUser(user.id);

  const profile: [string, string][] = [
    ["Name", `${user.firstName} ${user.lastName}`],
    ["Email", user.email],
    ["Phone", `${user.countryCode} ${user.phone}`],
    ["Company", user.company || "—"],
    ["Country", user.country || "—"],
    ["Member since", formatDate(user.createdAt)],
  ];

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/account", label: "My Account" },
        ]}
        title={`Hi, ${user.firstName}`}
        description="Manage your profile, orders, downloads and licences."
      />
      <div className="bg-soft">
        <div className="container-x grid gap-6 py-10 lg:grid-cols-[340px_1fr] lg:items-start">
          <section aria-labelledby="profile-title" className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 id="profile-title" className="text-lg font-semibold text-ink">
              Profile
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              {profile.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-body">{k}</dt>
                  <dd className="font-medium break-words text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <LogoutButton />
            </div>
          </section>

          <section id="orders" aria-labelledby="orders-title" className="scroll-mt-24">
            <h2 id="orders-title" className="mb-4 text-lg font-semibold text-ink">
              My Orders ({list.length})
            </h2>
            {list.length ? (
              <div className="space-y-4">
                {list.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                <Package aria-hidden="true" className="mx-auto size-12 text-brand-600" strokeWidth={1.5} />
                <p className="mt-4 text-lg font-semibold text-ink">No orders yet</p>
                <p className="mt-2 text-body">When you buy a product it will appear here with its download links.</p>
                <Link href="/products" className="btn-primary mt-6">
                  Browse Products
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
