import { Content, IntegrationField, LinkField, asText, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { ShowcaseCard } from "./ShowcaseCard";
import { Container } from "@/components/Container";
import { UnderlineDoodle } from "@/components/UnderlineDoodle";
import {
  WebsiteDocument,
  getShowcaseWebsites,
} from "@/utils/getShowcaseWebsites";
import { ThemeContainer } from "@/components/Theme";

export type Website = {
  name: string;
  screenshot: {
    url: string;
    alt?: string;
  };
  link: LinkField;
  technology?: string;
  industry?: string;
};

/**
 * Props for `FeaturedWebsitesList`.
 */
export type FeaturedWebsitesListProps =
  SliceComponentProps<Content.FeaturedWebsitesListSlice>;

/**
 * Component for "FeaturedWebsitesList" Slices.
 */
const FeaturedWebsitesList = async ({ slice }: FeaturedWebsitesListProps) => {
  const showcaseWebsites: WebsiteDocument[] = await getShowcaseWebsites(3);

  const websiteList: Website[] =
    slice.variation == "autoList"
      ? showcaseWebsites?.map((website) => ({
          name: asText(website.data.name),
          screenshot: {
            url: website.data.screenshot.url!,
            alt: website.data.screenshot.alt!,
          },
          link: isFilled.link(website.data.link)
            ? {
                link_type: website.data.link.link_type,
                url: website.data.link.url,
                target: website.data.link.target,
              }
            : {
                link_type: "Web",
                url: "#",
              },
          technology: website.data.website_technology.uid,
          industry: website.data.industry.uid,
        }))
      : slice.primary.websites?.map(
          (website) =>
            (({
              ...website.website,
              link: { url: website.website?.website_link, link_type: "Web" },
            } as IntegrationField<Website>)!)
        );

  const themeColor =
    slice.primary.theme === "Blue" || slice.primary.theme === "Dark"
      ? "dark"
      : "light";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={slice.primary.anchor || undefined}
    >
      <ThemeContainer
        theme={slice.primary.theme}
        className="py-16 sm:px-16 md:py-24 lg:py-24"
      >
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <PrismicRichText
            field={slice.primary.title}
            components={{
              heading2: ({ children }) => (
                <h2
                  className={`text-3xl text-center font-display leading-10 tracking-tight ${
                    themeColor === "dark" ? "text-white" : "text-dark-gray"
                  }`}
                >
                  {children}
                </h2>
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
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => (
                <p
                  className={`mt-4 text-lg tracking-tight ${
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
        {websiteList?.length > 0 ? (
          <Container className="grid gird-cols-1 py-16 px-10 sm:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-6">
            {websiteList.map((website: Website, idx: number) => (
              <ShowcaseCard website={website} key={idx} />
            ))}
          </Container>
        ) : (
          <p className={`py-16 px-10 text-center ${
            themeColor === "dark"
              ? "text-light-gray"
              : "text-light-black"
          }`}>No results</p>
        )}
      </ThemeContainer>
    </section>
  );
};

export default FeaturedWebsitesList;
