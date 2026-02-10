// components/brand/logo.tsx
import Image from "next/image";
import Link from "next/link";

type Props = {
  variant?: "full" | "symbol";
  className?: string;
  href?: string;
};

export default function BrandLogo({ variant = "full", className = "", href = "/" }: Props) {
  const src = variant === "symbol" ? "/brand/symbol.svg" : "/brand/logo.svg";

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt="Simbu"
        width={variant === "symbol" ? 70 : 280}
        height={64}
        priority
      />
    </Link>
  );
}
