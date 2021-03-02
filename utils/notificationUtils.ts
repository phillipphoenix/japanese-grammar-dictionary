// The parameter names used for the URL query params.
export const notiTitleParam = "notiTitle";
export const notiDescParam = "notiDesc";
export const notiStatusParam = "notiStatus";

/**
 * Create a query param string that can be appended after a route URL.
 * By default the ? is added as a prefix, but can be ommitted using the options.
 */
export const getNotificationQueryParams = (
  {
    title,
    description,
    status,
  }: {
    title: string;
    description?: string;
    status?: "info" | "success" | "warning" | "error";
  },
  options?: { addPrefix?: boolean }
): string => {
  // Set default options and overwrite with given options.
  const opts = {
    addPrefix: true,
    ...(options || {}),
  };
  // Generate URI encoded string with all params.
  const uriParams = `${opts.addPrefix ? "?" : ""}${notiTitleParam}=${title}${
    description ? `&${notiDescParam}=` + description : ""
  }${status ? `&${notiStatusParam}=` + status : ""}`;
  return encodeURI(uriParams);
};
