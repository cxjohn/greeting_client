import "../styles/globals.css";
import Script from "next/script";
import { hotjar } from "react-hotjar";
import { useEffect } from "react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    hotjar.initialize(3312801, 6);
  }, []);
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-FJ6DM716KE`}
      />

      <Script id="ga-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-FJ6DM716KE');
          `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
