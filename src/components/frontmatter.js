import React from 'react';

const Frontmatter = ({ frontmatter }) => (
  <>
    {frontmatter.date}
    &nbsp;&nbsp;
    {frontmatter.authors && frontmatter.authors.length > 0 ? '作者：' : null}
    {frontmatter.authors &&
      frontmatter.authors.map((author, index) => (
        <span key={author.id}>
          {!author.social ? (
            <span>{author.name}</span>
          ) : (
            <a target="_blank" rel="noopener noreferrer" href={author.social}>
              {author.name}
            </a>
          )}
          {index < frontmatter.authors.length - 1 ? <span>,&nbsp;</span> : <span>&nbsp;</span>}
        </span>
      ))}
    &nbsp;&nbsp;
    {frontmatter.translators && frontmatter.translators.length > 0 ? '译者：' : null}
    {frontmatter.translators &&
      frontmatter.translators.map((translator, index) => (
        <span key={translator.id}>
          <a target="_blank" rel="noopener noreferrer" key={translator.id} href={translator.social}>
            {translator.name}
          </a>
          {index < frontmatter.translators.length - 1 ? <span>,&nbsp;</span> : <span>&nbsp;</span>}
        </span>
      ))}
  </>
);

export default Frontmatter;
