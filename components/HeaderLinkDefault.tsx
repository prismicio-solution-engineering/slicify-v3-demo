import {
  HeaderDocumentDataLeftSideLinksItem,
  Simplify,
} from "@/prismicio-types";
import { PrismicNextLink } from "@prismicio/next";

export default function HeaderLinkDefault(
  link: Simplify<HeaderDocumentDataLeftSideLinksItem>
) {
  return (
    <div className="hidden md:block">
      <PrismicNextLink
        field={link.link}
        className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      />
    </div>
  );
}
