import { FC } from "react";
import styles from "../styles/components/NarrowContainer.module.css";

const NarrowContainer: FC = ({ children }) => {
  return <div className={`${styles.narrowContainer}`}>{children}</div>;
};

export default NarrowContainer;
