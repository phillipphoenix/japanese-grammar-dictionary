import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import styles from "../styles/components/Page.module.css";

export interface PageProps {
  title: string;
  tabTitle?: string;
}

const Page: FC<PageProps> = ({ children, title, tabTitle }) => {
  return (
    <div className={`${styles.page} ${styles.dark}`}>
      <Head>
        <title>{tabTitle || title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1>{title}</h1>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>Made with ☕ by Phillip</p>
        <p>
          <Link href="/credits">Go to credits page</Link>
        </p>
      </footer>
    </div>
  );
};

export default Page;
