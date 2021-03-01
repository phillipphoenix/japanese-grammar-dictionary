import { FC, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

/**
 * Looks for the the query params described below and creates a toast notification, if found.
 * - notificationTitle *: If present a notification will be shown. This is the notification title.
 * - notificationDescription: The notification description.
 * - notificationStatus: The status type of the notification ("info", "success", "warning", "error").
 */
const Notification: FC = () => {
  const { query, replace, pathname } = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Check if there are any query messages in the URL.
    const {
      notificationTitle,
      notificationDescription,
      notificationStatus,
      ...queryRest
    }: {
      notificationTitle: string;
      notificationDescription: string;
      notificationStatus: undefined | "info" | "success" | "warning" | "error";
    } = query as any;

    if (!!notificationTitle) {
      toast({
        title: notificationTitle,
        description: notificationDescription,
        status: notificationStatus,
        isClosable: true,
      });
      // Remove query params.
      replace(
        {
          pathname: pathname,
          query: { ...queryRest },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [query]);

  return <></>;
};

export default Notification;
