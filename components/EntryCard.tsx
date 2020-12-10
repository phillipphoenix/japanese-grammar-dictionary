import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
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

export const EntryCardSkeleton: FC = () => {
  return (
    <div className={`${styles.entryCard}`}>
      <SkeletonTheme color="#dedede" highlightColor="#c7c7c7">
        <div className={styles.cardHeader}>
          <h2>
            <Skeleton />
          </h2>
        </div>
        <hr />
        <Skeleton count={3} />
      </SkeletonTheme>
    </div>
  );
};

export default EntryCard;
