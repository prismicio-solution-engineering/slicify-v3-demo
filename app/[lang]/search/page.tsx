import React from "react";
import { ArticleListVertical } from "@/components/ArticleListVertical";
import { performSearch } from "@/utils/performSearch";
import MarketingLayout from "@/components/MarketingLayout";
import { getLanguages } from "@/utils/getLanguages";
import { Content, asText } from "@prismicio/client";
import { createClient } from "@/prismicio";
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
    page = await client.getSingle("search", {
      lang: params.lang,
    });
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getSingle("search", {
        lang: "en-us",
      });
    } catch (fallbackError) {
      notFound();
    }
  }

  return {
    title: asText(page.data.title),
    description: `${page.data.title} : ${page.data.title}`,
  };
}

export default async function SearchPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: string };
  searchParams: { query?: string; page?: string };
}) {
  const locales = await getLocales();

  // Get the initial query parameter from the URL
  const initialQuery = searchParams.query || "";

  const client = createClient();

  let page;
  try {
    page = await client.getSingle<Content.SearchDocument>("search", {
      lang,
    });
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getSingle<Content.SearchDocument>("search", {
        lang: "en-us",
      });
    } catch (fallbackError) {
      notFound();
    }
  }

  const [header, footer] = await Promise.all([
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
  ]);

  // Pass the initialQuery to performSearch
  const results = await performSearch(
    initialQuery ? initialQuery.trim() : "",
    (lang = lang)
  );
  const languages = await getLanguages(page, client, locales);
  if (searchParams.query) {
    languages.forEach(function (language, index) {
      languages[index].url = language.url + "?query=" + initialQuery;
    });
  }

  return (
    <>
      <MarketingLayout
        header={header.data}
        footer={footer.data}
        languages={languages}
      >
        <ArticleListVertical
          page={page}
          searchResults={results ?? []}
          lang={lang}
        />
      </MarketingLayout>
    </>
  );
}
