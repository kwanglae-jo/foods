import { ComponentPropsWithoutRef } from "react";

type TrackedLinkProps = ComponentPropsWithoutRef<"a"> & {
  gtmLabel: string;
};

export default function TrackedLink({
  gtmLabel,
  ...props
}: TrackedLinkProps) {
  return <a data-gtm-label={gtmLabel} {...props} />;
}
