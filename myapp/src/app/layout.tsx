import './globals.css'
import { Inter } from 'next/font/google'
import Chat from './../components/Chat.tsx';
import Providers from './../components/Providers';

 
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bookishh',
  description: 'A Place where you find your books easily',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
      <body className={inter.className}>
      {/* <h2>Hello</h2> this will visible at every where */}
        <Chat/>
        {children}
      </body>
      </Providers>
    </html>
  )
}
