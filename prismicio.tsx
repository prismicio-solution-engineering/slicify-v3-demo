import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "./slicemachine.config.json";

export const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT
  ? process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT
  : sm.repositoryName;

// Update the routes array to match your project's route structure
/** @type {prismic.ClientConfig['routes']} **/
const routes = [
  {
    type: "home_page",
    path: "/:lang/",
  },
  {
    type: "blog_index",
    path: "/:lang/blog",
  },
  {
    type: "blog_article",
    resolvers: {
      category: "category",
    },
    path: "/:lang/blog/:category?/:uid",
  },
  {
    type: "landing_page",
    path: "/:lang/lp/:uid",
  },
  {
    type: "search",
    path: "/:lang/search",
  },
];

export const createClient = (config = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { revalidate: 60 } }
        : { next: { revalidate: 5 } },
    ...config,
  });
  prismicNext.enableAutoPreviews({ client });
  return client;
};
