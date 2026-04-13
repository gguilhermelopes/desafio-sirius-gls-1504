import React from "react";
import Link from "next/link";

type AuthFooterLinkProps = {
  className?: string;
  href: string;
  linkClassName?: string;
  linkLabel: string;
  prefix?: string;
  prefixClassName?: string;
};

export function AuthFooterLink({
  className,
  href,
  linkClassName,
  linkLabel,
  prefix,
  prefixClassName,
}: AuthFooterLinkProps) {
  return (
    <p className={className}>
      {prefix ? <span className={prefixClassName}>{prefix} </span> : null}
      <Link className={linkClassName} href={href}>
        {linkLabel}
      </Link>
    </p>
  );
}
