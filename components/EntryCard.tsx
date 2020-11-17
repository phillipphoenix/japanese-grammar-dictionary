import { FC } from "react";
import styles from "../styles/components/EntryCard.module.css";

export interface EntryCardProps {
  title: string;
  descriptors?: string;
  description: string;
}

const EntryCard: FC<EntryCardProps> = ({ title, descriptors, description }) => {
  return (
    <div className={`${styles.entryCard}`}>
      <div className={styles.cardHeader}>
        <h2>
          {title} <small className={styles.descriptors}>{descriptors}</small>
        </h2>
      </div>
      <hr />
      <div className={styles.cardBody}>{description}</div>
    </div>
  );
};

export default EntryCard;
