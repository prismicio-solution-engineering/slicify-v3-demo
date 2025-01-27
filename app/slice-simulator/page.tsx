"use client";

import { SliceSimulator } from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";

import { components as mktComponents } from "../../slices/marketing";
import { components as blogComponents } from "../../slices/blog";

export default function SliceSimulatorPage() {
  return (
    <SliceSimulator
      sliceZone={(props) => (
        <SliceZone
          {...props}
          components={{ ...mktComponents, ...blogComponents }}
        />
      )}
    />
  );
}

// SM v 1.25 - for Next dynamic functions
// import {
//   SliceSimulator,
//   SliceSimulatorParams,
//   getSlices,
// } from "@slicemachine/adapter-next/simulator";
// import { SliceZone } from "@prismicio/react";
// import { components as mktComponents } from "../../slices/marketing";
// import { components as blogComponents } from "../../slices/blog";

// export default function SliceSimulatorPage({
//   searchParams,
// }: SliceSimulatorParams) {
//   const slices = getSlices(searchParams.state);

//   return (
//     <SliceSimulator>
//       <SliceZone
//         slices={slices}
//         components={{ ...mktComponents, ...blogComponents }}
//       />
//     </SliceSimulator>
//   );
// }
