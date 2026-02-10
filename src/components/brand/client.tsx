// components/brand/logo.tsx
import Image from "next/image";
import Link from "next/link";

type Props = {
  variant?: "full" | "symbol";
  className?: string;
  href?: string;
};

export default function ClientLogo({ variant = "full", className = "", href = "/" }: Props) {
  const src = variant === "symbol" ? "/brand/client.png" : "/brand/client.svg";

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt="FGC"
        width={variant === "symbol" ? 280 : 1020}
        height={480}
        priority
      />
    </Link>
  );
}
