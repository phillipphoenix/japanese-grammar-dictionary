import { FC } from "react";
import Link from "next/link";
import Page from "../components/Page";
import NarrowContainer from "../components/NarrowContainer";
import styles from "../styles/Credits.module.css";

const Credits: FC = () => {
  return (
    <Page title="Credits" tabTitle="日本語 Grammar Dictionary">
      <NarrowContainer>
        <div className={styles.credits}>
          <h2>
            <Link href="/">Go to frontpage</Link>
          </h2>
          <div>
            <h2>日本語 Grammar Dictionary:</h2>
            <p>Created by Phillip Phoelich.</p>
            <p>
              The project started late 2020. The main parts of the site were finished during
              december 2020, but entries are added continuously.
            </p>
          </div>
          <div>
            <h2>Icons:</h2>
            <div>
              Icons made by{" "}
              <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">
                Freepik
              </a>{" "}
              from{" "}
              <a href="https://www.flaticon.com/" title="Flaticon" target="_blank">
                www.flaticon.com
              </a>
            </div>
            <div>
              Specific icons are found at{" "}
              <a
                href="https://www.flaticon.com/packs/ui-super-basic"
                title="ui-super-pack"
                target="_blank"
              >
                UI Super Pack
              </a>
              .
            </div>
          </div>
        </div>
      </NarrowContainer>
    </Page>
  );
};

export default Credits;
