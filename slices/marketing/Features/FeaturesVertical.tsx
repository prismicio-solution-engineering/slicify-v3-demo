"use client";

import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { Container } from "@/components/Container";
import { asText } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { Simplify } from "@prismicio/types/dist/value/types";
import {
  FeaturesSliceAbovePrimaryFeaturesItem,
  FeaturesSliceBelowPrimaryFeaturesItem,
} from "@/prismicio-types";
import { ThemeContainer } from "@/components/Theme";

function Feature({
  feature,
  isActive,
  className,
  themeColor,
  ...props
}: {
  feature: (
    | Simplify<FeaturesSliceBelowPrimaryFeaturesItem>
    | Simplify<FeaturesSliceAbovePrimaryFeaturesItem>
  ) & { eyebrowElement?: JSX.Element };
  isActive: boolean;
  className: string;
  themeColor: "dark" | "light";
}) {
  return (
    <div
      className={clsx(className, !isActive && "opacity-75 hover:opacity-100")}
      {...props}
    >
      <div
        className={clsx(
          "w-9 rounded-lg",
          isActive ? "bg-blue-600" : "bg-slate-500"
        )}
      >
        <PrismicNextImage
          className="h-9 w-9 fill-none aria-hidden"
          field={feature.icon}
          sizes="52.75rem"
        />
      </div>
      <div
        className={`${themeColor === "dark" ? "text-white" : "text-dark-gray"}`}
      >
        {feature.eyebrowElement}
      </div>
      <PrismicRichText
        field={feature.feature_title}
        components={{
          paragraph: ({ children }) => (
            <p
              className={`mt-2 font-display text-xl ${
                themeColor === "dark" ? "text-white" : "text-dark-gray"
              }`}
            >
              {children}
            </p>
          ),
        }}
      />
      <PrismicRichText
        field={feature.feature_description}
        components={{
          paragraph: ({ children }) => (
            <p
              className={`mt-4 text-sm ${
                themeColor === "dark" ? "text-white" : "text-dark-gray"
              }`}
            >
              {children}
            </p>
          ),
        }}
      />
    </div>
  );
}

function FeaturesMobile({
  slice,
  themeColor,
}: {
  slice: Content.FeaturesSliceBelow | Content.FeaturesSliceAbove;
  themeColor: "dark" | "light";
}) {
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {slice.primary.features?.map((feature) => (
        <div key={asText(feature.feature_title)}>
          <Feature
            feature={feature}
            themeColor={themeColor}
            className="mx-auto max-w-2xl"
            isActive
          />
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6" />
            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
              <PrismicNextImage
                className="object-cover hidden md:block"
                field={feature.feature_screenshot}
                width={844}
                height={428}
              />
              <PrismicNextImage
                className="object-cover md:hidden"
                field={feature.feature_screenshot.mobile}
                width={390}
                height={263}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop({
  slice,
  above,
  themeColor,
}: {
  slice: Content.FeaturesSliceBelow | Content.FeaturesSliceAbove;
  above: boolean;
  themeColor: "dark" | "light";
}) {
  return (
    <Tab.Group as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          {!above && (
            <Tab.List className="grid grid-cols-3 gap-x-8">
              {slice.primary.features?.map((feature, featureIndex) => (
                <Feature
                  key={asText(feature.feature_title)}
                  themeColor={themeColor}
                  feature={{
                    ...feature,
                    eyebrowElement: (
                      <Tab
                        className={`focus-visible:outline-0 ${
                          themeColor === "dark"
                            ? "text-white"
                            : "text-dark-gray"
                        }`}
                      >
                        <span className="absolute inset-0" />
                        {asText(feature.eyebrow)}
                      </Tab>
                    ),
                  }}
                  isActive={featureIndex === selectedIndex}
                  className="relative"
                />
              ))}
            </Tab.List>
          )}
          <Tab.Panels
            className={`relative overflow-hidden rounded-4xl bg-slate-200 px-14 py-16 xl:px-16 ${
              above === false && "mt-20"
            }`}
          >
            <div className="-mx-5 flex">
              {slice.primary.features?.map((feature, featureIndex) => (
                <Tab.Panel
                  static
                  key={asText(feature.feature_title)}
                  className={clsx(
                    "px-5 transition duration-500 ease-in-out [&:not(:focus-visible)]:focus:outline-none",
                    featureIndex !== selectedIndex && "opacity-60"
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
                    <PrismicNextImage
                      className="w-full"
                      field={feature.feature_screenshot}
                      sizes="52.75rem"
                    />
                  </div>
                </Tab.Panel>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-slate-900/10" />
          </Tab.Panels>
          {above && (
            <Tab.List className="grid grid-cols-3 gap-x-8 mt-20">
              {slice.primary.features?.map((feature, featureIndex) => (
                <Feature
                  key={asText(feature.feature_title)}
                  themeColor={themeColor}
                  feature={{
                    ...feature,
                    eyebrowElement: (
                      <Tab
                        className={`focus-visible:outline-0 ${
                          themeColor === "dark"
                            ? "text-white"
                            : "text-dark-gray"
                        }`}
                      >
                        <span className="absolute inset-0" />
                        {asText(feature.eyebrow)}
                      </Tab>
                    ),
                  }}
                  isActive={featureIndex === selectedIndex}
                  className="relative"
                />
              ))}
            </Tab.List>
          )}
        </>
      )}
    </Tab.Group>
  );
}

export default function FeaturesVertical({
  slice,
  above = false,
}: {
  slice: Content.FeaturesSliceBelow | Content.FeaturesSliceAbove;
  above: boolean;
}) {
  const themeColor =
    slice.primary.theme === "Blue" || slice.primary.theme === "Dark"
      ? "dark"
      : "light";

  return (
    <section
      id={slice.primary.anchor || undefined}
      aria-label="Features for simplifying everyday business tasks"
    >
      <ThemeContainer
        theme={slice.primary.theme}
        className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
      >
        <Container>
          <div className="mx-auto max-w-2xl md:text-center">
            <PrismicRichText
              field={slice.primary.title}
              components={{
                heading2: ({ children }) => (
                  <h2
                    className={`font-display text-3xl tracking-tight ${
                      themeColor === "dark" ? "text-white" : "text-dark-gray"
                    } sm:text-4xl`}
                  >
                    {children}
                  </h2>
                ),
              }}
            />
            <PrismicRichText
              field={slice.primary.subtitle}
              components={{
                paragraph: ({ children }) => (
                  <p
                    className={`mt-4 text-lg tracking-tight ${
                      themeColor === "dark" ? "text-white" : "text-light-black"
                    }`}
                  >
                    {children}
                  </p>
                ),
              }}
            />
          </div>
          <FeaturesMobile slice={slice} themeColor={themeColor} />
          <FeaturesDesktop
            slice={slice}
            above={above}
            themeColor={themeColor}
          />
        </Container>
      </ThemeContainer>
    </section>
  );
}
