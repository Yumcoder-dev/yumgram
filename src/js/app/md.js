/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-param-reassign */
// reactjs sanitize test :)
const parseMd = md => {
  // var rgx = /^(\d+)/ — You can use a regular expression literal and enclose the pattern between
  // slashes. This is evaluated at compile time and provides better performance if the regular
  // expression stays constant.
  //
  // g — Search the string for all matches of given expression instead of returning just the first one.
  //
  // m — This flag will make sure that the ^ and $ tokens look for a match at the beginning or end
  // of each line instead of the whole string.
  //
  // ^ — Look for the regular expression at the beginning of the string or the beginning of a line
  // if the multiline flag is enabled.

  // ul = unordered (bulleted) list
  // * Unordered list can use asterisks
  // - Or minuses
  // + Or pluses
  md = md.replace(/^\s*\n\*/gm, '<ul>\n*');
  md = md.replace(/^(\*.+)\s*\n([^*])/gm, '$1\n</ul>\n\n$2');
  md = md.replace(/^\*(.+)/gm, '<li>$1</li>');

  // ol = ordered list
  // 1. First ordered list item
  // 2. Another item
  // ⋅⋅* Unordered sub-list.
  // 1. Actual numbers don't matter, just that it's a number
  // ⋅⋅1. Ordered sub-list
  // 4. And another item.
  md = md.replace(/^\s*\n\d\./gm, '<ol>\n1.');
  md = md.replace(/^(\d\..+)\s*\n([^\d.])/gm, '$1\n</ol>\n\n$2');
  md = md.replace(/^\d\.(.+)/gm, '<li>$1</li>');

  // blockquote
  // > text
  md = md.replace(/^>(.+)/gm, '<blockquote>$1</blockquote>');

  // h
  // # H1
  // ## H2
  // ### H3
  // #### H4
  // ##### H5
  // ###### H6
  md = md.replace(/[#]{6}(.+)/g, '<h6>$1</h6>');
  md = md.replace(/[#]{5}(.+)/g, '<h5>$1</h5>');
  md = md.replace(/[#]{4}(.+)/g, '<h4>$1</h4>');
  md = md.replace(/[#]{3}(.+)/g, '<h3>$1</h3>');
  md = md.replace(/[#]{2}(.+)/g, '<h2>$1</h2>');
  md = md.replace(/[#]{1}(.+)/g, '<h1>$1</h1>');

  // alt h
  // Alt-H1
  // ======
  // Alt-H2
  // ------
  md = md.replace(/^(.+)\n=+/gm, '<h1>$1</h1>');
  md = md.replace(/^(.+)\n-+/gm, '<h2>$1</h2>');

  // images
  // ![Placehold.it 200x200 image](http://placehold.it/200x200)
  md = md.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // links
  // [I'm an inline-style link](https://www.google.com)
  md = md.replace(
    /[[]{1}([^\]]+)[\]]{1}[(]{1}([^)"]+)("(.+)")?[)]{1}/g,
    '<a href="$2" title="$4">$1</a>',
  );

  // font styles
  // Emphasis, aka italics, with *asterisks* or _underscores_.
  // Strong emphasis, aka bold, with **asterisks** or __underscores__.
  // Combined emphasis with **asterisks and _underscores_**.
  // Strikethrough uses two tildes. ~~Scratch this.~~
  md = md.replace(/[*_]{2}([^*_]+)[*_]{2}/g, '<b>$1</b>');
  md = md.replace(/[*_]{1}([^*_]+)[*_]{1}/g, '<i>$1</i>');
  md = md.replace(/[~]{2}([^~]+)[~]{2}/g, '<del>$1</del>');

  // pre
  md = md.replace(/^\s*\n```(([^\s]+))?/gm, '<pre class="$2">');
  md = md.replace(/^```\s*\n/gm, '</pre>\n\n');

  // code
  // ```javascript
  // var s = "JavaScript syntax highlighting";
  // alert(s);
  // ```
  md = md.replace(/[`]{1}([^`]+)[`]{1}/g, '<code>$1</code>');

  // p
  md = md.replace(/^\s*(\n)?(.+)/gm, m => {
    return /<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : `${m}`;
  });

  // strip p from pre
  md = md.replace(/(<pre.+>)\s*\n<p>(.+)<\/p>/gm, '$1$2');

  return md;
};

export default parseMd;
