import React from 'react'
import './styles.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomComp from '@/globals/BottomComp'
import NextJsTopLoader from '@/lib/NextJsTopLoader'

export const metadata = {
  description: 'Created by Trae Zeeofor',
  title: 'PayloadCMS From Scratch',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="antialiased flex flex-col justify-center items-center min-h-screen w-full font-trebuchetMs">
        <NextJsTopLoader />
        <Header />
        <main className="flex-grow h-full w-full">{children}</main>
        <BottomComp />
        <Footer />
      </body>
    </html>
  )
}
