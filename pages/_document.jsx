import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="google-site-verification" content="B0jup2cuRtIDQWWREl9IzbM9uEiqZYULkpf2HLerssY" />
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
