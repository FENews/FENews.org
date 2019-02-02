import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
// import { getContactHref } from '../../../utils';
import styles from './Author.module.scss';

const qrcode = require('../../../../static/media/qrcode.jpg');

export const PureAuthor = ({ data }) => {
  const { author } = data.site.siteMetadata;

  return (
    <div className={styles['author']}>
      <p className={styles['author__bio']}>
        {author.bio} 如果你喜欢我们的文章，请关注我们的公众号:
        <img src={qrcode} alt="qrcode" />
      </p>
    </div>
  );
};

export const Author = (props) => (
  <StaticQuery
    query={graphql`
      query AuthorQuery {
        site {
          siteMetadata {
            author {
              name
              bio
            }
          }
        }
      }
    `}
    render={(data) => <PureAuthor {...props} data={data} />}
  />
);

export default Author;
