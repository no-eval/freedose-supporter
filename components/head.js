import { Fragment } from "react";
import NextHead from "next/head";

export const Head = ({ title, children }) => (
  <Fragment>
    <NextHead>
      {/* title & description */}
      <title>{title}</title>
      <meta
        name="description"
        content="Freedose is a free platform that connects people in low income households with financially priviledged citizens to fund their Covid-19 vaccine."
      />

      {/* content compatibility */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      {/* font */}
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

      {/* pwa compatibility */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/freedose.svg" color="#3A3AD3" />

      {/* twitter open graph data */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Freedose" />
      <meta
        name="twitter:description"
        content="Freedose is a free platform that connects people in low income households with financially priviledged citizens to fund their Covid-19 vaccine."
      />
      <meta name="twitter:creator" content="@freedose" />
      <meta name="twitter:image" content="" />
      <meta name="twitter:image:alt" content="" />

      {/* regular open graph data */}
      <meta property="og:title" content="Freedose" />
      <meta property="og:url" content="" />
      <meta property="og:image" content="" />
      <meta property="og:image:alt" content="" />
      <meta
        property="og:description"
        content="Freedose is a free platform that connects people in low income households with financially priviledged citizens to fund their Covid-19 vaccine."
      />
      <meta property="og:site_name" content="Freedose" />

      {/* render children passed by the page, if any */}
      {children}
    </NextHead>
  </Fragment>
);
