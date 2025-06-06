import type { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { UnderlineDoodle } from "@/components/UnderlineDoodle";
import { ThemeContainer } from "@/components/Theme";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

export default function Hero({ slice }: HeroProps) {
  const themeColor =
    slice.primary.theme === "Blue" || slice.primary.theme === "Dark"
      ? "dark"
      : "light";

  return (
    <section id={slice.primary.anchor || undefined}>
      <ThemeContainer theme={slice.primary.theme}>
        <Container className="pb-16 pt-20 text-center lg:pt-32">
          <PrismicRichText
            field={slice.primary.title}
            components={{
              heading1: ({ children }) => (
                <h1
                  className={`mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight ${
                    themeColor === "dark" ? "text-white" : "text-dark-gray"
                  } sm:text-7xl`}
                >
                  {children}
                </h1>
              ),
              strong: ({ children }) => {
                return (
                  <>
                    <span
                      className={`relative whitespace-nowrap ${
                        themeColor === "dark"
                          ? "text-white"
                          : "text-vibrant-blue"
                      }`}
                    >
                      <UnderlineDoodle
                        className={`absolute left-0 top-2/3 h-[0.58em] w-full ${
                          themeColor === "dark"
                            ? "fill-white"
                            : "fill-blue-300/70"
                        }`}
                      />
                      <span className="relative">{children}</span>
                    </span>
                  </>
                );
              },
            }}
          />
          {slice.variation === "default" && (
            <>
              <PrismicRichText
                field={slice.primary.description}
                components={{
                  paragraph: ({ children }) => (
                    <p
                      className={`mx-auto mt-6 max-w-2xl text-lg tracking-tight ${
                        themeColor === "dark" ? "text-white" : "text-dark-gray"
                      }`}
                    >
                      {children}
                    </p>
                  ),
                }}
              />
              <div className="mt-10 flex justify-center gap-x-6">
                {slice.primary.cta_link?.map((link) => {
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
            </>
          )}
        </Container>
      </ThemeContainer>
    </section>
  );
}
