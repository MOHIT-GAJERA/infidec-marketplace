import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CartView } from "@/components/checkout/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/cart", label: "Cart" },
        ]}
        title="Shopping Cart"
        description="Review your selected products, licences and installation plans."
      />
      <div className="bg-soft">
        <div className="container-x py-10">
          <CartView />
        </div>
      </div>
    </>
  );
}
