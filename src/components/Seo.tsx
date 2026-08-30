import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
  getRoute,
  ogImagePath,
  webPageJsonLd,
} from "@/data/seo";

interface SeoProps {
  /** Route path registered in src/data/seo.ts */
  path: string;
}

export function Seo({ path }: SeoProps) {
  const route = getRoute(path);
  const url = `${SITE_URL}${route.path}`;
  const image = `${SITE_URL}${ogImagePath(route.path)}`;

  return (
    <Helmet>
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={route.path === "/" ? "website" : "article"} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={route.title} />
      <meta name="twitter:description" content={route.description} />
      <meta name="twitter:image" content={image} />
      {route.noindex ? <meta name="robots" content="noindex" /> : null}
      <script type="application/ld+json">{JSON.stringify(webPageJsonLd(route))}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd(route))}</script>
    </Helmet>
  );
}
