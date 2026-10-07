import Image from "next/image";
import Link from "next/link";
import logo from "../../public/main-logo.png";
import logoWhite from "../../public/main-logo-white.png";
import { site } from "@/lib/site";

/** "dark" uses the white-wordmark version for dark backgrounds. */
type Props = { className?: string; preload?: boolean; tone?: "light" | "dark" };

export function Logo({ className = "h-12 w-auto", preload = false, tone = "light" }: Props) {
  return (
    <Link href="/" aria-label={`${site.name} home`} className="inline-flex shrink-0 items-center">
      <Image
        src={tone === "dark" ? logoWhite : logo}
        alt={`${site.name} logo`}
        className={className}
        sizes="(min-width: 640px) 128px, 112px"
        preload={preload}
        placeholder="empty"
      />
    </Link>
  );
}
