import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';
import Pagination from '../components/Pagination';

const TagTemplate = ({ data, pageContext }) => {
  const {
    title: siteTitle,
    subtitle: siteSubtitle
  } = data.site.siteMetadata;

  const {
    tag,
    currentPage,
    prevPagePath,
    nextPagePath,
    hasPrevPage,
    hasNextPage
  } = pageContext;

  const { edges } = data.allMarkdownRemark;
  const pageTitle = currentPage > 0 ? `All Posts tagged as "${tag}" - Page ${currentPage} - ${siteTitle}` : `All Posts tagged as "${tag}" - ${siteTitle}`;

  return (
    <Layout title={pageTitle} description={siteSubtitle}>
      <Sidebar />
      <Page title={tag}>
        <Feed edges={edges} />
        <Pagination
          prevPagePath={prevPagePath}
          nextPagePath={nextPagePath}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
        />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query TagPage($tag: String, $postsLimit: Int!, $postsOffset: Int!) {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    allMarkdownRemark(
        limit: $postsLimit,
        skip: $postsOffset,
        filter: { frontmatter: { tags: { in: [$tag] }, template: { eq: "post" }, draft: { ne: true } } },
        sort: { order: DESC, fields: [frontmatter___date] }
      ){
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;

export default TagTemplate;
