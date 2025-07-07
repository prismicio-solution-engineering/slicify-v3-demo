import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Button } from "@/components/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Icon } from "@/components/Icon";

/**
 * Props for `HeroWithSideImageAndFeatures`.
 */
export type HeroWithSideImageAndFeaturesProps =
  SliceComponentProps<Content.HeroWithSideImageAndFeaturesSlice>;

/**
 * Component for "HeroWithSideImageAndFeatures" Slices.
 */
const HeroWithSideImageAndFeatures: FC<HeroWithSideImageAndFeaturesProps> = ({
  slice,
}) => {
  const primary = slice.primary;
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              {primary.label && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-vibrant-blue hover:bg-blue-100">
                  <p>{primary.label}</p>
                </div>
              )}
              {primary.title && (
                <div>
                  <PrismicRichText
                    field={primary.title}
                    components={{
                      heading1: ({ children }) => (
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                          {children}
                        </h1>
                      ),
                      label: ({ node, children }) => {
                        return (
                          <>
                            {node.data.label === "highlight" && (
                              <span className="bg-gradient-to-r from-vibrant-blue to-purple-600 bg-clip-text text-transparent">
                                {children}
                              </span>
                            )}
                          </>
                        );
                      },
                    }}
                  />
                </div>
              )}
              {primary.description && (
                <div className="text-xl text-gray-600 leading-relaxed">
                  <PrismicRichText field={primary.description} />
                </div>
              )}
            </div>

            {primary.buttons &&
              Array.isArray(primary.buttons) &&
              primary.buttons.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {primary.buttons.map((button, idx) =>
                    button.variant === "Primary" ? (
                      <Button
                        key={idx}
                        field={button}
                        variation="primary"
                        className="bg-gradient-to-r from-vibrant-blue to-purple-600 hover:from-vibrant-blue hover:to-purple-700"
                      />
                    ) : (
                      <Button
                        key={idx}
                        field={button}
                        variation="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        {button.text}
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Button>
                    )
                  )}
                </div>
              )}

            {primary.features &&
              Array.isArray(primary.features) &&
              primary.features.length > 0 && (
                <div className="flex items-center space-x-8 pt-8">
                  {primary.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      {feature.icon &&
                        (feature.icon.url?.includes(".svg") ? (
                          <Icon
                            src={feature.icon.url}
                            size="xs"
                            color="blue"
                            fallback={feature.icon}
                          />
                        ) : (
                          <PrismicNextImage
                            field={feature.icon}
                            className="h-5 w-5 text-vibrant-blue"
                            imgixParams={{
                              monochrome: "2563eb",
                            }}
                          />
                        ))}
                      {feature.text && (
                        <span className="text-sm text-gray-600">
                          <p>{feature.text}</p>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="relative">
            <div className="relative z-10">
              {primary.side_image && (
                <PrismicNextImage
                  field={primary.side_image}
                  className="rounded-2xl shadow-2xl"
                  width={500}
                  height={600}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-3xl opacity-20 transform rotate-6"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWithSideImageAndFeatures;
