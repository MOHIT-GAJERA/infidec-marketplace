import type { Metadata } from "next";
import Script from "next/script";
import { PageHeader } from "@/components/PageHeader";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/cart", label: "Cart" },
          { href: "/checkout", label: "Checkout" },
        ]}
        title="Secure Checkout"
        description="Enter your billing details and choose a payment method to complete your purchase."
      />
      <div className="bg-soft">
        <div className="container-x py-10">
          <CheckoutForm />
        </div>
      </div>
    </>
  );
}
