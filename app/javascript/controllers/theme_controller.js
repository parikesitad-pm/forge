import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
    const theme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', theme);
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');

    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);

    localStorage.setItem('theme', next);
  }
}
