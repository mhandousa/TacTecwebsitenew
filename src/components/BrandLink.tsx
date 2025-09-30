import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

type BrandLinkProps = {
  className?: string;
  children?: ReactNode;
};

const defaultLogo = (
  <Image
    src="/images/Tactec-Lock-1-2-1.webp"
    alt="TACTEC"
    width={160}
    height={52}
    priority
    className="h-10 w-auto"
  />
);

export default function BrandLink({ className, children }: BrandLinkProps) {
  const combinedClassName = clsx(
    "inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500",
    className,
  );

  return (
    <Link href="/" aria-label="TACTEC home" className={combinedClassName}>
      {children ?? defaultLogo}
    </Link>
  );
}
