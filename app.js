// Links remain usable without JavaScript; enhance them to an accessible tab set.
const navigation = document.querySelector('.tabs');
const tabs = [...navigation.querySelectorAll('a')];
const panels = [...document.querySelectorAll('.panel')];
navigation.setAttribute('role', 'tablist');
for (const tab of tabs) {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', tab.hash.slice(1));
}
for (const panel of panels) {
  panel.setAttribute('role', 'tabpanel');
  panel.tabIndex = 0;
}
function activate(id, focus = false) {
  if (id === 'stack') id = 'skills';
  if (id === 'recognition') id = 'education';
  if (!panels.some(panel => panel.id === id)) id = 'about';
  tabs.forEach(tab => {
    const selected = tab.hash === `#${id}`;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  panels.forEach(panel => { panel.hidden = panel.id !== id; });
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || !panels.some(panel => `#${panel.id}` === link.hash)) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  activate(link.hash.slice(1));
  if (!link.closest('.tabs')) {
    const panel = document.querySelector(link.hash);
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({ block: 'start' });
  }
});
navigation.addEventListener('keydown', event => {
  const index = tabs.indexOf(document.activeElement);
  if (index < 0) return;
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length - 1;
  if (next === undefined) return;
  event.preventDefault();
  history.replaceState(null, '', tabs[next].hash);
  activate(tabs[next].hash.slice(1), true);
});
window.addEventListener('hashchange', () => activate(location.hash.slice(1)));
window.addEventListener('popstate', () => activate(location.hash.slice(1)));
activate(location.hash.slice(1));

// Reveal the profile name once on load, keeping a single accessible name.
const profileName = document.querySelector('.profile h1');
if (profileName) {
  profileName.setAttribute('aria-label', 'Saikarthick Chandrasekaran');
  let letterIndex = 0;
  for (const node of [...profileName.childNodes]) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const fragment = document.createDocumentFragment();
    for (const character of node.textContent) {
      const letter = document.createElement('span');
      letter.className = 'name-letter';
      letter.textContent = character;
      letter.setAttribute('aria-hidden', 'true');
      letter.style.setProperty('--letter-delay', `${letterIndex++ * 65}ms`);
      fragment.append(letter);
    }
    node.replaceWith(fragment);
  }
}
