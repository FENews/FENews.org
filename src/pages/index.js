import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>
                {node.frontmatter.date}
                &nbsp;&nbsp;
                {node.frontmatter.authors && node.frontmatter.authors.length> 0 ? '作者：' : null}
                {node.frontmatter.authors && node.frontmatter.authors.map(author =>(
                  <span key={author.id} >
                    <a target="_blank" rel="noopener noreferrer" href={author.social}>{author.name}</a>
                    &nbsp;
                  </span>
                ))}
                &nbsp;&nbsp;
                {node.frontmatter.translators && node.frontmatter.translators.length > 0 ? '译者：' : null}
                {node.frontmatter.translators && node.frontmatter.translators.map(translator => (
                  <span key={translator.id}>
                    <a target="_blank" rel="noopener noreferrer" key={translator.id} href={translator.social}>{translator.name}</a>
                    &nbsp;
                  </span>
                ))}
              </small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY年MM月DD日")
            title
            description
            translators {
              id
              name
              avatar
              social
            }
            authors {
              id
              name
              avatar
              social
            }
          }
        }
      }
    }
  }
`
