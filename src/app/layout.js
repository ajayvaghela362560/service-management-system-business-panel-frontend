import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ConfigurableValues from "@/config/constants";
import ApolloClientWrapper from "@/apollo/apolloWrapper";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import NextTopLoader from "nextjs-toploader";
import { Lato } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default function RootLayout({ children }) {
  const { GOOGLE_CLIENT_ID } = ConfigurableValues();

  return (
    <html lang='en' className={`${lato.className}`} suppressHydrationWarning>
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <ApolloClientWrapper>
          <NuqsAdapter>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <Toaster />
              {children}
            </GoogleOAuthProvider>
          </NuqsAdapter>
        </ApolloClientWrapper>
      </body>
    </html>
  );
}
