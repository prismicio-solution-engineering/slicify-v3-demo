import type { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import FaqCentered from "./FaqCentered";
import FaqThreeColumns from "./FaqThreeColumns";

export type FaqProps = SliceComponentProps<Content.FaqSlice>;

export default function Faq({ slice }: FaqProps) {
  switch (slice.variation) {
    case "twoColumns":
      return <FaqThreeColumns slice={slice} threeCols={false} />;
    case "threeColumns":
      return <FaqThreeColumns slice={slice} threeCols={true} />;
    case "centered":
      return <FaqCentered slice={slice} />;
  }
}
