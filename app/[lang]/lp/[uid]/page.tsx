import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices/marketing";
import MarketingLayout from "@/components/MarketingLayout";
import { getLanguages } from "@/utils/getLanguages";
import { notFound } from "next/navigation";
import { getLocales } from "@/utils/getLocales";
import { Metadata } from "next";

type PageParams = { uid: string; lang: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const client = createClient();

  let page;
  try {
    page = await client.getByUID("landing_page", params.uid, {
      lang: params.lang,
    });
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getByUID("landing_page", params.uid, {
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
export default async function LandingPage({ params }: { params: PageParams }) {
  const locales = await getLocales();

  const client = createClient();

  let page;
  try {
    page = await client.getByUID<Content.LandingPageDocument>(
      "landing_page",
      params.uid,
      { lang: params.lang }
    );
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getByUID<Content.LandingPageDocument>(
        "landing_page",
        params.uid,
        { lang: "en-us" }
      );
    } catch (fallbackError) {
      notFound();
    }
  }

  const [header, footer, languages] = await Promise.all([
    client
      .getSingle<Content.HeaderDocument>("header", {
        lang: params.lang,
      })
      .catch(() =>
        client.getSingle<Content.HeaderDocument>("header", {
          lang: "en-us",
        })
      ),
    client
      .getSingle<Content.FooterDocument>("footer", {
        lang: params.lang,
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

// Paths
export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("landing_page", { lang: "*" });

  return pages.map((page) => {
    return { uid: page.uid, lang: page.lang };
  });
}
