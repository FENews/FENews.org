import Typography from 'typography';
import stAnnesTheme from 'typography-theme-st-annes';

stAnnesTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  'h2,h3': {
    marginBottom: rhythm(1 / 2),
    marginTop: rhythm(2),
  },
  em: {
    color: 'hsla(0,0%,0%,0.59);',
    fontSize: rhythm(0.6),
    marginBottom: rhythm(1 / 2),
  },
  blockquote: {
    marginRight: rhythm(0.6),
    paddingLeft: rhythm(0.2),
    fontSize: rhythm(0.6),
    borderLeft: 0,
    borderColor: 'transparent',
    textAlign: 'center',
  },
  'blockquote p': {
    display: 'inline-block',
    textAlign: 'left',
  },
  p: {
    marginBottom: rhythm(0.8),
    lineHeight: 1.8,
    wordBreak: 'word-all',
  },
  img: {
    display: 'block',
    width: '100%',
    maxWidth: rhythm(40),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  iframe: {
    height: rhythm(16),
    width: '100%',
  },
  a: {
    color: 'rgb(21, 153, 87)',
    textDecoration: 'underscore',
  },
  '.language-text': {
    color: 'inherit !important',
    background: '#eee !important',
  },
});

const typography = new Typography(stAnnesTheme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
