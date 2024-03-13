import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [quoteWrapper, authorWrapper] = block.children;

  // get the paragraph and its parent
  let par = quoteWrapper.querySelector('p');
  if (par) {
    const parWrapper = par.parentElement;
    // create a new <blockquote> we will wrap it in
    const blockquote = document.createElement('blockquote');
    // move the instrumentation from the paragraph wrapper to the <blockquote> (if any)
    moveInstrumentation(parWrapper, blockquote);
    // replace the paragraph wrapper with the <blockquote>
    parWrapper.replaceWith(blockquote);
    // and append all quote paragraphs to the <blockquote>
    blockquote.append(...parWrapper.children);
  }

  // request the /authors.json index
  par = authorWrapper.querySelector('p');
  let quotee = par.textContent.trim();
  let quotees = await fetch('/authors.json');
  if (quotees.ok) {
    // get the returned json as javascript object
    quotees = await quotees.json();
    // find the first entry that's title matches our quotee
    quotee = quotees.data.find(({ title }) => title.toLowerCase() === quotee.toLowerCase());
    if (quotee) {
      const { path } = quotee;
      const a = document.createElement('a');
      a.href = path;
      a.append(...par.childNodes);
      moveInstrumentation(par, a);
      par.replaceChildren(a);
    }
  }
}
