import type { Content } from "@prismicio/client";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { PrismicRichText } from "@prismicio/react";
import { UnderlineDoodle } from "@/components/UnderlineDoodle";
import { ThemeContainer } from "@/components/Theme";

export default function CtaSimple({
  slice,
  withBackground = true,
}: {
  slice: Content.CallToActionSliceDefault;
  withBackground: boolean;
}) {
  const themeColor =
    slice.primary.theme === "Blue" || slice.primary.theme === "Dark"
      ? "dark"
      : "light";

  return (
    <section id={slice.primary.anchor || undefined}>
      <ThemeContainer
        theme={slice.primary.theme}
        className={`relative overflow-hidden ${
          withBackground && "bg-blue-600"
        } py-32`}
      >
        <Container className="relative">
          <div className="mx-auto max-w-lg text-center">
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
                strong: ({ children }) => {
                  return (
                    <>
                      {themeColor === "light" ? (
                        <span className="relative whitespace-nowrap text-blue-600">
                          <UnderlineDoodle className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70" />
                          <span className="relative">{children}</span>
                        </span>
                      ) : (
                        <span className="relative whitespace-nowrap">
                          <UnderlineDoodle className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70" />
                          <span className="relative">{children}</span>
                        </span>
                      )}
                    </>
                  );
                },
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
            <Button
              field={slice.primary.cta_link}
              color={themeColor === "dark" ? "white" : "slate"}
              className="mt-10"
            />
          </div>
        </Container>
      </ThemeContainer>
    </section>
  );
}
