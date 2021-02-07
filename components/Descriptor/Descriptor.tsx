import { FC } from "react";
import styles from "./Descriptor.module.css";

export interface DescriptorProps {
  // Data props.
  text: string;
  // Other.
  className?: string;
}

const Descriptor: FC<DescriptorProps> = ({ text, className }) => {
  return <small className={`${styles.descriptor} ${className}`}>{text}</small>;
};

export default Descriptor;
