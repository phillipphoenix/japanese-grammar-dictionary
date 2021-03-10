const patternRegex = /(((?:\{|\｛)[^\}\｝]+(?:\}|\｝)(?:\（|\()[^\}\｝]+(?:\）|\)))+)/g;
const kanjiRegex = /(?:\{|\｛)([^\}\｝]+)(?:\}|\｝)(?:\（|\()([^\}\｝]+)(?:\）|\))/g;

//
// CODE ATTRIBUTION:
// This code was found in an open source library
//

interface FuriganaOptions {
  skipFurigana?: boolean;
  /**
   * A percentage number of the normal text size. Default is 70% (number is 70).
   */
  furiganaFontSize?: number;
}

/**
 * Converts a text with the format "{私}(わたし)はジョーと{申}(もう)します" to HTML that displays furigana correct.
 * @param text
 * @param skipFurigana If true, furigana will be stripped from the text. Useful to display the text without furigana, but also without the furigana annotations.
 * @returns
 */
const convert = (
  text: string,
  { skipFurigana = false, furiganaFontSize = 70 }: FuriganaOptions = {}
): string => {
  let match;

  while ((match = patternRegex.exec(text))) {
    const html = !skipFurigana ? ["<ruby>"] : [];
    const phrase = match[0];

    let secondMatch;
    while ((secondMatch = kanjiRegex.exec(phrase))) {
      const kanji = secondMatch[1];
      const reading = secondMatch[2];

      html.push(kanji);
      if (!skipFurigana) {
        html.push(`<rt style='font-size:${furiganaFontSize}%;'>`);
        html.push(reading);
        html.push("</rt>");
      }
    }

    if (!skipFurigana) {
      html.push("</ruby>");
    }

    text = match.input.replace(phrase, html.join(""));
  }

  return text;
};

/**
 * Returns a function that can convert text with the format "{私}(わたし)はジョーと{申}(もう)します"
 * into correct HTML. Wrap kanji in { } followed by parenthesis with the furigana.
 * @returns
 */
export const useFurigana = () => {
  return [convert];
};

/*

CODE ATTRIBUTION:
This code was found in the following open-source repository:
https://github.com/joeellis/showdown-kanji

LICENSE: Beerware -> https://en.wikipedia.org/wiki/Beerware

<joe@joeellis.la> wrote this file.  As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.

*/
