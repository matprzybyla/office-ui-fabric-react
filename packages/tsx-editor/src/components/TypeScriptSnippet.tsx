import * as React from 'react';
import { IRawStyle, mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { FontSizes } from '@uifabric/fluent-theme';

// react-syntax-highlighter has typings, but they're wrong aside from the props and missing many paths...
// tslint:disable no-any
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
const SyntaxHighlighter = require<{
  default: React.ComponentType<SyntaxHighlighterProps> & { registerLanguage: (lang: string, func: any) => void };
}>('react-syntax-highlighter/dist/esm/prism-light').default;
const ts = require<any>('react-syntax-highlighter/dist/esm/languages/prism/tsx').default;
const style: { [key: string]: IRawStyle } = require('react-syntax-highlighter/dist/styles/prism/vs').default;
// tslint:enable no-any

// Register languages
SyntaxHighlighter.registerLanguage('tsx', ts);

/** Font family for code snippets/editors */
export const codeFontFamily = 'Monaco, Menlo, Consolas, "Droid Sans Mono", "Inconsolata", "Courier New", monospace';

// Customize the styles, including to match the colors from Monaco
// (because that looks better but also because Monaco's colors are more accesssible)
// https://github.com/conorhastings/react-syntax-highlighter/blob/master/src/styles/prism/vs.js
const colorMap: { [key: string]: string } = {
  '#2b91af': '#008080', // class name
  '#36acaa': '#09885a', // number
  '#ff0000': '#ee0000', // attrs, various (not from monaco)
  '#393a34': '#000000' // operators, function names
};
const codeStyle: IRawStyle = {
  fontFamily: codeFontFamily,
  fontSize: FontSizes.size12, // matches Monaco
  color: 'black',
  lineHeight: '1.6',
  border: 'none',
  margin: 0
};
for (const key of Object.keys(style)) {
  // No extra background colors or italics
  delete style[key].background;
  delete style[key].backgroundColor;
  delete style[key].fontStyle;

  if (key.indexOf('::') !== -1 || key.indexOf(':not(pre) > code') === 0 || key === 'code[class*="language-css"]') {
    // delete special selection styles, inline code styles, and special CSS styles
    delete style[key];
  } else if (key.indexOf('code[') === 0) {
    style[key] = {
      ...style[key],
      ...codeStyle
    };
  } else if (key.indexOf('pre[') === 0) {
    style[key] = {
      ...style[key],
      ...codeStyle,
      padding: '6px 20px',
      background: 'white'
    };
  } else {
    // correct text colors (convert to lowercase due to inconsistent casing)
    const color = (style[key].color || '').toLowerCase();
    if (colorMap[color]) {
      style[key].color = colorMap[color];
    }
  }
}

const rootClass = mergeStyles({
  maxHeight: 400
});
const lineNumberStyle: React.CSSProperties = {
  color: '#237893', // matches Monaco
  paddingRight: 6
};

export interface ITypeScriptSnippetProps {
  className?: string;
}

export const TypeScriptSnippet: React.FunctionComponent<ITypeScriptSnippetProps> = props => {
  return (
    <SyntaxHighlighter
      className={css(rootClass, props.className)}
      language="tsx"
      showLineNumbers
      lineNumberStyle={lineNumberStyle}
      style={style}
    >
      {props.children}
    </SyntaxHighlighter>
  );
};
