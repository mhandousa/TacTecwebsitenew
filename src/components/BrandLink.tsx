import Link from "next/link";
import { ReactNode } from "react";

type BrandLinkProps = {
  className?: string;
  children?: ReactNode;
};

export default function BrandLink({ className, children }: BrandLinkProps) {
  const combinedClassName = [
    "text-2xl font-bold text-sky-600 hover:text-sky-700 transition",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href="/" aria-label="TACTEC home" className={combinedClassName}>
      {children ?? "TACTEC"}
    </Link>
  );
}
