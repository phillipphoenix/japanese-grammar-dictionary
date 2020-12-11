import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import styles from "../styles/components/Card.module.css";

export interface CardProps {
  className?: string;
}

export const Card: FC<CardProps> = ({ className, children }) => {
  return <div className={`${styles.entryCard} ${className}`}>{children}</div>;
};

export interface CardHeaderProps {}

export const CardHeader: FC<CardHeaderProps> = ({ children }) => {
  return (
    <>
      <div className={styles.cardHeader}>{children}</div>
      <hr />
    </>
  );
};

export interface CardBodyProps {}

export const CardBody: FC<CardBodyProps> = ({ children }) => {
  return <div className={styles.cardBody}>{children}</div>;
};

export interface CardSkeletonProps {
  hasHeader?: boolean;
}

export const CardSkeleton: FC<CardSkeletonProps> = ({ hasHeader }) => {
  return (
    <div className={`${styles.entryCard}`}>
      <SkeletonTheme color="#dedede" highlightColor="#c7c7c7">
        {hasHeader && (
          <>
            <div className={styles.cardHeader}>
              <h2>
                <Skeleton />
              </h2>
            </div>
            <hr />
          </>
        )}
        <Skeleton count={3} />
      </SkeletonTheme>
    </div>
  );
};
