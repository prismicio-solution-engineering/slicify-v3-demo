"use client";

import { useEffect, useId, useState } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { DiamondIcon } from "@/components/DiamondIcon";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { ThemeContainer } from "@/components/Theme";

function ImageClipPaths({
  id,
  ...props
}: React.ComponentPropsWithoutRef<"svg"> & { id: string }) {
  return (
    <svg aria-hidden="true" width={0} height={0} {...props}>
      <defs>
        <clipPath id={`${id}-0`} clipPathUnits="objectBoundingBox">
          <path d="M0,0 h0.729 v0.129 h0.121 l-0.016,0.032 C0.815,0.198,0.843,0.243,0.885,0.243 H1 v0.757 H0.271 v-0.086 l-0.121,0.057 v-0.214 c0,-0.032,-0.026,-0.057,-0.057,-0.057 H0 V0" />
        </clipPath>
        <clipPath id={`${id}-1`} clipPathUnits="objectBoundingBox">
          <path d="M1,1 H0.271 v-0.129 H0.15 l0.016,-0.032 C0.185,0.802,0.157,0.757,0.115,0.757 H0 V0 h0.729 v0.086 l0.121,-0.057 v0.214 c0,0.032,0.026,0.057,0.057,0.057 h0.093 v0.7" />
        </clipPath>
        <clipPath id={`${id}-2`} clipPathUnits="objectBoundingBox">
          <path d="M1,0 H0.271 v0.129 H0.15 l0.016,0.032 C0.185,0.198,0.157,0.243,0.115,0.243 H0 v0.757 h0.729 v-0.086 l0.121,0.057 v-0.214 c0,-0.032,0.026,-0.057,0.057,-0.057 h0.093 V0" />
        </clipPath>
      </defs>
    </svg>
  );
}
/**
 * Props for `Team`.
 */
export type TeamProps = SliceComponentProps<Content.TeamSlice>;

/**
 * Component for "Team" Slices.
 */
const Team = ({ slice }: TeamProps): JSX.Element => {
  let id = useId();
  let [tabOrientation, setTabOrientation] = useState("horizontal");

  useEffect(() => {
    let lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  const themeColor =
    slice.primary.theme === "Blue" || slice.primary.theme === "Dark"
      ? "dark"
      : "light";

  return (
    <section id="speakers" aria-labelledby="speakers-title">
      <ThemeContainer theme={slice.primary.theme} className="py-20 sm:py-32">
        <ImageClipPaths id={id} />
        <div className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8")}>
          <div className="mx-auto max-w-2xl lg:mx-0">
            <PrismicRichText
              field={slice.primary.title}
              components={{
                heading2: ({ children }) => (
                  <h2
                    className={`font-display text-4xl font-medium tracking-tighter sm:text-5xl ${
                      themeColor === "dark" ? "text-white" : "text-vibrant-blue"
                    }`}
                  >
                    {children}
                  </h2>
                ),
              }}
            />
            <PrismicRichText
              field={slice.primary.description}
              components={{
                paragraph: ({ children }) => (
                  <p
                    className={`mt-4 font-display text-2xl tracking-tight ${
                      themeColor === "dark"
                        ? "text-light-gray"
                        : "text-light-black"
                    }`}
                  >
                    {children}
                  </p>
                ),
              }}
            />
          </div>
          <Tab.Group vertical={tabOrientation === "vertical"}>
            <div className="mt-14 grid grid-cols-1 items-start gap-x-8 gap-y-8 sm:mt-16 sm:gap-y-16 lg:mt-24 lg:grid-cols-4">
              <div className="relative -mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:block sm:overflow-visible sm:pb-0">
                <div className="absolute bottom-0 left-0.5 top-0 hidden w-px bg-light-blue-70 lg:block" />
                <Tab.List className="grid auto-cols-auto grid-flow-col justify-start gap-x-8 gap-y-10 whitespace-nowrap px-4 sm:mx-auto sm:max-w-2xl sm:grid-cols-3 sm:px-0 sm:text-center lg:grid-flow-row lg:grid-cols-1 lg:text-left">
                  {({ selectedIndex }: { selectedIndex: number }) => (
                    <>
                      <div className="relative lg:pl-8">
                        <DiamondIcon
                          className={clsx(
                            "absolute left-[-0.5px] top-[0.5625rem] hidden h-2 w-2 overflow-visible lg:block",
                            0 === selectedIndex && themeColor === "dark"
                              ? "fill-white stroke-white"
                              : 0 === selectedIndex && themeColor === "light"
                              ? "fill-vibrant-blue stroke-vibrant-blue"
                              : "fill-light-blue-70 stroke-light-blue-70"
                          )}
                        />
                        <div className="relative">
                          <div
                            className={clsx(
                              "font-mono text-sm",
                              1 === selectedIndex
                                ? "text-vibrant-blue"
                                : "text-light-blue"
                            )}
                          >
                            <Tab className="focus-visible:outline-0">
                              <span className="absolute inset-0" />
                              <div
                                className={`mt-1.5 block text-2xl font-semibold tracking-tight focus-visible:outline-0 ${
                                  themeColor === "dark"
                                    ? "text-light-gray"
                                    : "text-light-blue"
                                }`}
                              >
                                {slice.primary.board_group_label}
                              </div>
                            </Tab>
                          </div>
                        </div>
                      </div>
                      <div className="relative lg:pl-8">
                        <DiamondIcon
                          className={clsx(
                            "absolute left-[-0.5px] top-[0.5625rem] hidden h-2 w-2 overflow-visible lg:block",
                            1 === selectedIndex && themeColor === "dark"
                              ? "fill-white stroke-white"
                              : 1 === selectedIndex && themeColor === "light"
                              ? "fill-vibrant-blue stroke-vibrant-blue"
                              : "fill-light-blue-70 stroke-light-blue-70"
                          )}
                        />
                        <div className="relative">
                          <div
                            className={clsx(
                              "font-mono text-sm",
                              2 === selectedIndex
                                ? "text-vibrant-blue"
                                : "text-light-blue"
                            )}
                          >
                            <Tab className="focus-visible:outline-0">
                              <span className="absolute inset-0" />
                              <div
                                className={`mt-1.5 block text-2xl font-semibold tracking-tight ${
                                  themeColor === "dark"
                                    ? "text-light-gray"
                                    : "text-light-blue"
                                }`}
                              >
                                {slice.primary.team_group_label}
                              </div>
                            </Tab>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-3">
                <Tab.Panel
                  className="grid grid-cols-1 gap-x-8 gap-y-10 ui-not-focus-visible:outline-none sm:grid-cols-2 sm:gap-y-16 md:grid-cols-3"
                  unmount={false}
                >
                  {slice.primary.board_members?.map((member, idx) => (
                    <div key={idx}>
                      <div className="group relative h-[17.5rem] transform overflow-hidden rounded-4xl">
                        <div
                          className={clsx(
                            "absolute bottom-6 left-0 right-4 top-0 rounded-4xl border transition duration-300 group-hover:scale-95 xl:right-6",
                            [
                              "border-blue-300",
                              "border-indigo-300",
                              "border-sky-300",
                            ][idx % 3]
                          )}
                        />
                        <div className="absolute inset-0 bg-indigo-50">
                          <PrismicNextImage
                            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-110"
                            field={member.member_picture}
                            priority
                            sizes="(min-width: 1280px) 17.5rem, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      </div>
                      <h3
                        className={`mt-8 font-display text-xl font-bold tracking-tight ${
                          themeColor === "dark"
                            ? "text-white"
                            : "text-dark-gray"
                        }`}
                      >
                        {member.name}
                      </h3>
                      <p
                        className={`mt-1 text-base tracking-tight ${
                          themeColor === "dark"
                            ? "text-light-gray"
                            : "text-light-black"
                        }`}
                      >
                        {member.role}
                      </p>
                    </div>
                  ))}
                </Tab.Panel>
                <Tab.Panel
                  className="grid grid-cols-1 gap-x-8 gap-y-10 ui-not-focus-visible:outline-none sm:grid-cols-2 sm:gap-y-16 md:grid-cols-3"
                  unmount={false}
                >
                  {slice.primary.team_members?.map((member, idx) => (
                    <div key={idx}>
                      <div className="group relative h-[17.5rem] transform overflow-hidden rounded-4xl">
                        <div
                          className={clsx(
                            "absolute bottom-6 left-0 right-4 top-0 rounded-4xl border transition duration-300 group-hover:scale-95 xl:right-6",
                            [
                              "border-blue-300",
                              "border-indigo-300",
                              "border-sky-300",
                            ][idx % 3]
                          )}
                        />
                        <div className="absolute inset-0 bg-indigo-50">
                          <PrismicNextImage
                            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-110"
                            field={member.member_picture}
                            priority
                            sizes="(min-width: 1280px) 17.5rem, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      </div>
                      <h3
                        className={`mt-8 font-display text-xl font-bold tracking-tight ${
                          themeColor === "dark"
                            ? "text-white"
                            : "text-dark-gray"
                        }`}
                      >
                        {member.name}
                      </h3>
                      <p
                        className={`mt-1 text-base tracking-tight ${
                          themeColor === "dark"
                            ? "text-light-gray"
                            : "text-light-black"
                        }`}
                      >
                        {member.role}
                      </p>
                    </div>
                  ))}
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </div>
      </ThemeContainer>
    </section>
  );
};

export default Team;
