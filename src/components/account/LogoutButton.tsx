"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useStore();
  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.push("/");
        router.refresh();
      }}
      className="btn-outline"
    >
      <LogOut aria-hidden="true" className="size-4" /> Logout
    </button>
  );
}
