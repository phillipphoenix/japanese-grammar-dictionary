import { FC } from "react";
import styles from "./NarrowContainer.module.css";

export interface NarrowContainerProps {
  className?: string;
}

const NarrowContainer: FC<NarrowContainerProps> = ({ children, className }) => {
  return <div className={`${styles.narrowContainer} ${className}`}>{children}</div>;
};

export default NarrowContainer;
