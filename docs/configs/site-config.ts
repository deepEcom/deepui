const baseUrl = "https://github.com/deepecom/deepui";

const siteConfig = {
  repo: {
    url: baseUrl,
    editUrl: `${baseUrl}/edit/main/docs`,
    blobUrl: `${baseUrl}/blob/main`,
  },
  seo: {
    title: "Collection of Accessible React UI Components using TailwindCSS.",
    titleTemplate: "%s - DeepEcom UI",
    description:
      "Collection of Accessible React UI Components using TailwindCSS.",
    siteUrl: "https://ui.deepecom.com",
    twitter: {
      handle: "@deepui",
      site: "@deepui",
      cardType: "summary_large_image",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://ui.deepecom.com",
      title: "DeepEcom UI",
      description:
        "Collection of Accessible React UI Components using TailwindCSS.",
      site_name:
        "DeepEcom UI: Collection of Accessible React UI Components using TailwindCSS.",
      images: [
        {
          url: "https://ui.deepecom.com/og-image.png",
          width: 1200,
          height: 627,
          alt:
            "DeepEcom UI: Collection of Accessible React UI Components using TailwindCSS.",
        },
        {
          url: "https://ui.deepecom.com/twitter-og-image.png",
          width: 1012,
          height: 506,
          alt:
            "DeepEcom UI: Collection of Accessible React UI Components using TailwindCSS.",
        },
      ],
    },
  },
};

export default siteConfig;
