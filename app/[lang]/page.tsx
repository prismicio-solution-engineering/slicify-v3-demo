import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices/marketing";
import { getLanguages } from "@/utils/getLanguages";
import MarketingLayout from "@/components/MarketingLayout";
import { getLocales } from "@/utils/getLocales";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageParams = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const client = createClient();
  let page;
  try {
    page = await client.getSingle("home_page", {
      lang: params.lang,
    });
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getSingle("home_page", {
        lang: "en-us",
      });
    } catch (fallbackError) {
      notFound();
    }
  }

  return {
    title: page.data.meta_title || "",
    description: page.data.meta_description || "",
  };
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const locales = await getLocales();

  const client = createClient();

  let page;
  try {
    page = await client.getSingle<Content.HomePageDocument>("home_page", {
      lang,
    });
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getSingle<Content.HomePageDocument>("home_page", {
        lang: "en-us",
      });
    } catch (fallbackError) {
      notFound();
    }
  }

  const [header, footer, languages] = await Promise.all([
    client
      .getSingle<Content.HeaderDocument>("header", {
        lang,
      })
      .catch(() =>
        client.getSingle<Content.HeaderDocument>("header", {
          lang: "en-us",
        })
      ),
    client
      .getSingle<Content.FooterDocument>("footer", {
        lang,
      })
      .catch(() =>
        client.getSingle<Content.FooterDocument>("footer", {
          lang: "en-us",
        })
      ),
    getLanguages(page, client, locales),
  ]);

  return (
    <MarketingLayout
      header={header.data}
      footer={footer.data}
      languages={languages}
    >
      <SliceZone slices={page.data.slices} components={components} />
    </MarketingLayout>
  );
}
