import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components as mktComponents } from "@/slices/marketing";
import { components as blogComponents } from "@/slices/blog";
import { blogArticleGraphQuery } from "@/utils/graphQueries";
import { getLanguages } from "@/utils/getLanguages";
import BlogLayout from "@/components/BlogLayout";
import { Content } from "@prismicio/client";
import { notFound } from "next/navigation";
import { getLocales } from "@/utils/getLocales";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ articleSlug: string[]; lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { articleSlug, lang } = resolvedParams;
  const client = createClient();
  // const page = await client
  //   .getByUID(
  //     "blog_article",
  //     articleSlug[articleSlug.length - 1],
  //     {
  //       lang: lang,
  //     }
  //   )
  //   .catch(() => notFound());

  let page;
  try {
    page = await client.getByUID(
      "blog_article",
      articleSlug[articleSlug.length - 1],
      {
        lang: lang,
      }
    );
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getByUID(
        "blog_article",
        articleSlug[articleSlug.length - 1],
        {
          lang: "en-us",
        }
      );
    } catch (fallbackError) {
      notFound();
    }
  }
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ articleSlug: string[]; lang: string }>;
}) {
  const locales = await getLocales();
  const resolvedParams = await params;
  const { articleSlug, lang } = resolvedParams;

  const client = createClient();

  let page;
  try {
    page = await client.getByUID<Content.BlogArticleDocument>(
      "blog_article",
      articleSlug[articleSlug.length - 1],
      { graphQuery: blogArticleGraphQuery, lang: lang }
    );
  } catch (error) {
    // Try to fall back to the default locale (en-us)
    try {
      page = await client.getByUID<Content.BlogArticleDocument>(
        "blog_article",
        articleSlug[articleSlug.length - 1],
        { graphQuery: blogArticleGraphQuery, lang: "en-us" }
      );
    } catch (fallbackError) {
      notFound();
    }
  }

  const [header, footer, languages] = await Promise.all([
    client
      .getSingle<Content.HeaderDocument>("header", {
        lang: lang,
      })
      .catch(() =>
        client.getSingle<Content.HeaderDocument>("header", {
          lang: "en-us",
        })
      ),
    client
      .getSingle<Content.FooterDocument>("footer", {
        lang: lang,
      })
      .catch(() =>
        client.getSingle<Content.FooterDocument>("footer", {
          lang: "en-us",
        })
      ),
    getLanguages(page, client, locales),
  ]);

  return (
    <BlogLayout
      header={header.data}
      footer={footer.data}
      languages={languages}
      page={page}
    >
      <SliceZone
        slices={page.data.slices}
        components={{ ...mktComponents, ...blogComponents }}
      />
    </BlogLayout>
  );
}

// Paths
export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("blog_article", { lang: "*" });

  function splitUrl(url: string) {
    // Split the URL by '/' and remove any empty strings from the result
    const parts = url.split("/").filter((part) => part !== "");

    // Assuming the URL format is consistent and has the language code as the first part,
    // category as the third part, and UID as the last part
    if (parts.length === 3) {
      return {
        lang: parts[0] || "",
        articleSlug: parts[2] ? [parts[2]] : "",
      };
    }
    if (parts.length === 4) {
      return {
        lang: parts[0] || "",
        articleSlug: [parts[2] || "", parts[3] || ""],
      };
    }
    return null;
  }

  return pages
    .map((page) => {
      return splitUrl(page.url!);
    })
    .filter((page) => page !== null);
}
