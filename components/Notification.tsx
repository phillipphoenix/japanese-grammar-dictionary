import { FC, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { notiDescParam, notiStatusParam, notiTitleParam } from "../utils/notificationUtils";

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
    // query param names are fetched from notification utils.
    const {
      [notiTitleParam]: notiTitle,
      [notiDescParam]: notiDesc,
      [notiStatusParam]: notiStatus,
      ...queryRest
    }: {
      [notiTitleParam]: string;
      [notiDescParam]: string;
      [notiStatusParam]: undefined | "info" | "success" | "warning" | "error";
    } = query as any;

    if (!!notiTitle) {
      toast({
        title: notiTitle,
        description: notiDesc,
        status: notiStatus,
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
