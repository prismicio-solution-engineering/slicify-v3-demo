import type { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import LogoCloudGrid from "./LogoCloudGrid";
import LogoCloudSimple from "./LogoCloudSimple";
import LogoCloudSingle from "./LogoCloudSingle";

export type LogoCloudProps = SliceComponentProps<Content.LogoCloudSlice>;

export default function LogoCloud({ slice }: LogoCloudProps) {
  switch (slice.variation) {
    case "default":
      return <LogoCloudSimple slice={slice} />;
    case "single":
      return <LogoCloudSingle slice={slice} />;
    case "threeColumns":
      return <LogoCloudGrid slice={slice} />;
  }
}
