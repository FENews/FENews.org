import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
          &nbsp;&nbsp;
          {post.frontmatter.authors && post.frontmatter.authors.length > 0 ? '作者：' : null}
          {post.frontmatter.authors && post.frontmatter.authors.map(author =>(
            <span key={author.id} >
              <a target="_blank" rel="noopener noreferrer" href={author.social}>{author.name}</a>
              &nbsp;
            </span>
          ))}
          &nbsp;&nbsp;
          {post.frontmatter.translators && post.frontmatter.translators.length > 0 ? '译者：' : null}
          {post.frontmatter.translators && post.frontmatter.translators.map(translator => (
            <span key={translator.id}>
              <a target="_blank" rel="noopener noreferrer" key={translator.id} href={translator.social}>{translator.name}</a>
              &nbsp;
            </span>
          ))}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY年MM月DD日")
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
        tags
      }
    }
  }
`
