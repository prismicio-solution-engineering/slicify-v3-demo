import {
  SliceSimulator,
  SliceSimulatorParams,
  getSlices,
} from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";
import { components as mktComponents } from "../../slices/marketing";
import { components as blogComponents } from "../../slices/blog";

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone
        slices={slices}
        components={{ ...mktComponents, ...blogComponents }}
      />
    </SliceSimulator>
  );
}
