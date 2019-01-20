const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "FENews - a blog for frontend developer", // <title>
  shortSiteTitle: "FENews", // <title> ending for posts and pages
  siteDescription: "FENews is blog for frontend developer.",
  siteUrl: "http//fenews.org",
  pathPrefix: "",
  siteImage: "preview.jpg",
  siteLanguage: "en",
  // author
  authorName: "FENews",
  authorTwitterAccount: "leyayun",
  // info
  infoTitle: "FENews",
  infoTitleNote: "FENews blog",
  // manifest.json
  manifestName: "FENews",
  manifestShortName: "FENews", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "auneeyy@gmail.com",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://github.com/FENews" },
    // { name: "twitter", url: "https://twitter.com/greglobinski" },
    // { name: "facebook", url: "https://facebook.com/greglobinski" }
  ]
};
