import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Figtree } from 'next/font/google';
import {getLikedSongs} from "../actions/getLikedSongs";
import {getActiveProductsWithPrices} from "../actions/getActiveProductsWithPrices";
import {ToasterProvider} from "../providers/ToasterProvider";
import {SupabaseProvider} from "../providers/SupabaseProvider";
import {UserProvider} from "../providers/UserProvider";
import {ModalProvider} from "../providers/ModalProvider";
import { Sidebar } from '../components/Sidebar';
import {Player} from "../components/Player";

const font = Figtree({ subsets: ['latin'] });

//* Describe the web app
export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
};

export const revalidate = 0;

//* Main layout component for the app
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const likedSongs = await getLikedSongs();
  const products = await getActiveProductsWithPrices();

  //* Providers & Components
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png" />
      </head>
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products} />
            <Sidebar songs={likedSongs}>{children}</Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
