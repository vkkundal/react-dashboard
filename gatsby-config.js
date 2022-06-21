const path = require("path")
module.exports = {
  siteMetadata: {
    title: `Cary`,
    description: `Awesome Landing Page`,
    author: `@cary`,
  },
  plugins: [
    {
      resolve: `gatsby-alias-imports`,
      options: {
        rootFolder: `src`
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Cary Admin Panel`,
        short_name: `cary`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#506DA6`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-sass",
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: [
            "Poppins:100,200,300,400,500,600,700",
          ],
        },
      },
    },
   

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
