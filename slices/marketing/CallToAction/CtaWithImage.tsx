import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import clsx from "clsx";
import { ThemeContainer } from "@/components/Theme";

export default function CtaWithImage({
  slice,
  imageRight = true,
}: {
  slice:
    | Content.CallToActionSliceWithImageRight
    | Content.CallToActionSliceWithImageLeft;
  imageRight: boolean;
}) {
  const themeColor =
    slice.primary.theme === "Blue" || slice.primary.theme === "Dark"
      ? "dark"
      : "light";

  return (
    <section id={slice.primary.anchor || undefined}>
      <ThemeContainer
        theme={slice.primary.theme}
        className={`relative overflow-hidden bg-blue-600 pt-16`}
      >
        <Container className="relative isolate overflow-hidden px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div
            className={clsx(
              "mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left",
              !imageRight && "order-last"
            )}
          >
            <PrismicRichText
              field={slice.primary.title}
              components={{
                heading2: ({ children }) => (
                  <h2
                    className={`font-display text-3xl tracking-tight ${
                      themeColor === "dark" ? "text-white" : "text-dark-blue"
                    } sm:text-4xl`}
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
                    className={`mt-4 text-lg tracking-tight ${
                      themeColor === "dark" ? "text-white" : "text-dark-blue"
                    }`}
                  >
                    {children}
                  </p>
                ),
              }}
            />
            <div className="mt-10 lg:flex justify-start gap-x-6">
              {slice.primary.cta_link.map((link) => {
                return link.variant === "Secondary" ? (
                  <Button
                    key={link.key}
                    field={link}
                    color={themeColor === "dark" ? "white" : "slate"}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3 flex-none fill-light-blue group-active:fill-current"
                    >
                      <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
                    </svg>
                    <span className="ml-3">{link.text}</span>
                  </Button>
                ) : (
                  <Button
                    key={link.key}
                    field={link}
                    color={themeColor === "dark" ? "white" : "slate"}
                  />
                );
              })}
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8 lg:w-[45rem]">
            <PrismicNextImage
              className={clsx(
                "absolute w-[57rem] lg:w-[45rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10",
                imageRight ? "left-0 top-0" : "right-0 top-0"
              )}
              field={slice.primary.featured_image}
              width={1824}
              height={1080}
            />
          </div>
        </Container>
      </ThemeContainer>
    </section>
  );
}
