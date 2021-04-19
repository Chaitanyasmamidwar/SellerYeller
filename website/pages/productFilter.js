import styles from '../styles/Home.module.css'
import { USER_DETAILS } from '../config'

export default function Home({ orders }) {
    console.log("ORDERS FROM PROPS::::", orders)
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
            Product filter by ASIN
        </p>

        <div className={styles.grid}>
          <div href="https://nextjs.org/docs" className={styles.card}>
            <h3>Product ASIN (seperated by comma) &rarr;</h3>
            <input type='text' />
            <input type='submit' />
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

export const getStaticProps = async () => {
    //USE amazaon sp api lib
    const result = await fetch('http://localhost:3000/api/orders').then(res => res.json())


    return {
        props: {orders: result},
    }
}