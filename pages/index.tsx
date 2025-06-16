import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>DeFi Yield Quest</title>
        <meta name="description" content="DeFi Yield Quest Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to DeFi Yield Quest
        </h1>
      </main>
    </div>
  )
}

export default Home 