import Link from 'next/link'
import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { SPAPI_OAUTH_CODE, SP_CLIENT_ID, SP_CLIENT_SECRET, USER_DETAILS } from '../config'

export default function Home({amazon}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        {amazon.access_token}
        {amazon.refresh_token}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <Link href="/authorized" >
            <div className={styles.card}>
            <h3>Authorized page &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
            </div>
          </Link>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export const getStaticProps = async () => {
  const websiteUrl = 'https://eda89e0f017f.ngrok.io/'
  const encodedAuthCode = encodeURIComponent(SPAPI_OAUTH_CODE)
  const encodedClientId = encodeURIComponent(SP_CLIENT_ID)
  const encodedClientSecret = encodeURIComponent(SP_CLIENT_SECRET)
  const encodedRedirectUrl = encodeURIComponent(websiteUrl)
  const body = {
    grant_type: 'authorization_code',
    code: SPAPI_OAUTH_CODE,
    client_id: SP_CLIENT_ID,
    client_secret: SP_CLIENT_SECRET,
    redirect_uri: websiteUrl,
  }
  const authUri = `https://api.amazon.com/auth/o2/token`
  const result = await fetch(authUri, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
  
  if (result.status !== 200) {
    return {
      props: { amazon: {} },
    }
  }
  const amazon = await result.json()
  USER_DETAILS.access_token = amazon.access_token
  USER_DETAILS.refresh_token = amazon.refresh_token

  console.log(result, "result from amazon", USER_DETAILS)

  return {
    props: {
      amazon,
    }
  }
}