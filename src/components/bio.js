/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

function Bio({ children }) {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { description } = data.site.siteMetadata;
        return (
          <div
            style={{
              display: `flex`,
            }}
          >
            <p>
              {description}
              {children}
            </p>
          </div>
        );
      }}
    />
  );
}

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        description
      }
    }
  }
`;

export default Bio;
