import { Html, Head, Main, NextScript } from "next/document";
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script> */}
        <link
          rel="shortcut icon"
          href="rivora-favicon.ico"
          type="image/x-icon"
        />
      </Head>
      <body>
        <GoogleAnalytics trackPageViews gaMeasurementId="G-2SQ2FY87LM" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
