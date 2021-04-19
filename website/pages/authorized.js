import { useEffect } from 'react'
import styles from '../styles/Home.module.css'

const API_URL = 'http://localhost:3000'
//?spapi_oauth_code=RHtXMmUMjxaqPpeEGmrL&state=stateexample&selling_partner_id=A3US92A97K0SJP

export default function Home({ query }) {
  console.log("Amazon response in router obj", query)

  useEffect(() => {
    console.log('INside use effect with query params', query)
    if (query.spapi_oauth_code && query.state && query.selling_partner_id) {
      console.log('Triggering the api')
      fetch(`${API_URL}/api/seller`, { 
          method: 'POST', 
          body: JSON.stringify(query), 
          headers: { 'Content-Type': 'application/json'}
        })
    }
  }, [])


  return (
    <div className={styles.container}>
        <h1 className={styles.title}>
            THIS IS THE AUTHORIZED PAGE::::: THANK YOU!!
        </h1>
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <div href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </div>

        </div>

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

export async function getServerSideProps(context) {
  return {
    props: { query: context.query }, // will be passed to the page component as props
  }
}

