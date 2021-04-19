import styles from '../styles/Home.module.css'

const authUri = 'https://sellercentral.amazon.in/apps/authorize/consent?application_id=amzn1.sp.solution.79d775a5-8ff5-4342-8205-4cfe7a6c30db&state=stateexample&version=beta'

export default function Home() {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <div href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
            <button onClick={() => {
                window.location = authUri
            }}>Authorize</button>
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
