import type { NextPage } from 'next'
import Head from 'next/head'

import RouterV5 from '../../react-router-v5/src/App'

import RouterV6 from '../../react-router-v6/src/App'

const App: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App ith next-router and react-router</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      With Router V5
      <RouterV5 />
      With Router V6
      <RouterV6 />
    </>
  )
}

export default App
