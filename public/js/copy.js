// Wrap every <pre><code> in a positioned wrapper so the copy button stays
// in the top-right of the visible code block regardless of horizontal scroll.
const codeBlocks = document.querySelectorAll('pre:has(code)');

codeBlocks.forEach((pre) => {
  // Skip if already processed
  if (pre.parentElement && pre.parentElement.classList.contains('code-wrapper')) return;

  // Wrapper provides the positioning context for the copy button
  const wrapper = document.createElement('div');
  wrapper.classList.add('code-wrapper');
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  // Copy button icon
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '/copy.svg#empty');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('copy-svg');
  svg.appendChild(use);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Copy code');
  btn.appendChild(svg);
  btn.classList.add('copy-btn');
  btn.addEventListener('click', (e) => copyCode(e, pre));

  wrapper.appendChild(btn);
});

function copyCode(event, pre) {
  const codeEl = pre.querySelector('code');
  if (!codeEl) return;
  navigator.clipboard.writeText(codeEl.innerText);
  const use = event.currentTarget.querySelector('svg use');
  if (!use) return;
  use.setAttribute('href', '/copy.svg#filled');
  setTimeout(() => use.setAttribute('href', '/copy.svg#empty'), 800);
}
