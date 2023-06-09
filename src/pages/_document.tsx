import { Html, Head, Main, NextScript } from "next/document";

const MyDocument = () => {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="use-credentials"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bowlby+One+SC&family=Prompt:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-white dark:bg-black-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;