module.exports = {
  siteMetadata: {
    title: `FENews`,
    description: `FENews 是由一群热爱技术的前端小伙伴自发组成的团队。团队会定期创作和翻译前端相关的技术文章，同时我们也欢迎外部投稿或加入我们的核心编辑团队。`,
    siteUrl: `https://fenews.org`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-102151816-2`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `FENews.org`,
        short_name: `FENews`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/FENews-icon.jpeg`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: 'gatsby-plugin-sentry',
      options: {
        dsn: 'https://2bac2527d53d4dad8db23f741054f787@sentry.io/1426625',
        environment: process.env.NODE_ENV,
        enabled: (() => ['production', 'stage'].indexOf(process.env.NODE_ENV) !== -1)(),
      },
    },
    `gatsby-plugin-twitter`
  ],
  mapping: {
    'MarkdownRemark.frontmatter.authors': `AuthorsYaml`,
    'MarkdownRemark.frontmatter.translators': `AuthorsYaml`,
  },
};
