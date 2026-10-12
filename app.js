const pages = [...document.querySelectorAll('.page')];
const main = document.querySelector('main');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const contentsButton = document.querySelector('.contents-toggle');
const contents = document.querySelector('#contents');
let current = 0;

function closeContents() {
  contents.hidden = true;
  contentsButton.setAttribute('aria-expanded', 'false');
}
function showPage() {
  const id = location.hash.slice(1) || 'sampul';
  const index = pages.findIndex(page => page.id === id);
  current = index < 0 ? 0 : index;
  pages.forEach((page, i) => { page.hidden = i !== current; });
  main.scrollTop = 0;
  previous.disabled = current === 0;
  next.disabled = current === pages.length - 1;
  document.querySelector('#page-label').textContent = pages[current].dataset.title;
  document.querySelector('#page-count').textContent = `${String(current + 1).padStart(2, '0')} / ${pages.length}`;
  document.title = `${pages[current].dataset.title} — Study Overseas SMK Telkom Malang`;
  document.querySelectorAll('.primary-nav a, .contents a').forEach(link => {
    if (link.hash === `#${pages[current].id}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  closeContents();
}
function goTo(index) {
  if (index >= 0 && index < pages.length) location.hash = pages[index].id;
}
previous.addEventListener('click', () => goTo(current - 1));
next.addEventListener('click', () => goTo(current + 1));
window.addEventListener('hashchange', () => {
  if (location.hash === '#main') { main.focus(); return; }
  showPage();
  pages[current].querySelector('h1, h2').focus({preventScroll: true});
});
contentsButton.addEventListener('click', () => {
  const open = contents.hidden;
  contents.hidden = !open;
  contentsButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', event => {
  if (!contents.contains(event.target) && !contentsButton.contains(event.target)) closeContents();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeContents();
});

document.querySelectorAll('[data-tab-group]').forEach(group => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  function activate(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); activate(tabs[target], true); }
    });
  });
});
// One answer at a time keeps the brochure page compact.
document.querySelectorAll('.faq-list details').forEach(item => item.addEventListener('toggle', () => {
  if (item.open) document.querySelectorAll('.faq-list details').forEach(other => { if (other !== item) other.open = false; });
}));

const parentForm = document.querySelector('#parent-form');
const formStatus = document.querySelector('#form-status');
const submissionFrame = document.querySelector('.submission-frame');
let submissionPending = false;
submissionFrame.addEventListener('load', () => {
  if (!submissionPending) return;
  submissionPending = false;
  formStatus.textContent = 'Pilihan dan masukan berhasil dikirim ke sekolah.';
  parentForm.reset();
});
parentForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!parentForm.checkValidity()) {
    formStatus.textContent = 'Lengkapi nama orang tua, nama siswa, kelas, kontak, dan pilihan rute terlebih dahulu.';
    parentForm.reportValidity();
    return;
  }
  formStatus.textContent = 'Menyimpan pilihan Anda...';
  submissionPending = true;
  HTMLFormElement.prototype.submit.call(parentForm);
});
showPage();
