// import { type AppType } from "next/app";

// import { api } from "~/utils/api";

// import "~/styles/globals.css";
// import { ClerkProvider } from "@clerk/nextjs";
// // Caveat
// // import { Noto_Sans } from "next/font/google";

// // If loading a variable font, you don't need to specify the font weight
// // const font = Noto_Sans({ weight: "400", subsets: ["latin"] });

// const MyApp: AppType = ({ Component, pageProps: {session, ...pageProps} }) => {
//   return (
//     // <main className={font.className}>
//     // <ClerkProvider {...pageProps}>
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     // </ClerkProvider>
//     // </main>
//   );
// };

// export default api.withTRPC(MyApp);

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
