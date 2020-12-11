const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    register: true,
    scope: "/",
    dest: "public",
    publicExcludes: ["!manifest.json"], // Don't include manifest, as it will be impossible to update it later.
  },
});
