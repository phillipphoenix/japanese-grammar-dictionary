import { FC } from "react";
import styles from "./EntryCard.module.css";
import { ExampleData } from "../types/components/exampleData";
import { Card, CardBody, CardHeader, CardSkeleton } from "./Card";

export interface EntryCardProps {
  // Data props.
  title: string;
  tags?: string[];
  descriptors?: string;
  descriptionShort: string;
  examples?: ExampleData[];
  // Other.
  className?: string;
}

const EntryCard: FC<EntryCardProps> = ({ title, descriptors, descriptionShort, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <h2>
          {title} {descriptors && <small className={styles.descriptors}>{descriptors}</small>}
        </h2>
      </CardHeader>
      <CardBody>{descriptionShort}</CardBody>
    </Card>
  );
};

export const EntryCardSkeleton: FC = () => {
  return <CardSkeleton hasHeader={true} />;
};

export default EntryCard;
