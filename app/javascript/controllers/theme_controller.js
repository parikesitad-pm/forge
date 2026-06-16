import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['iconMoon', 'iconSun'];

  connect() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    this.#syncIcon(theme);
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    this.#syncIcon(next);
  }

  #syncIcon(theme) {
    const isDark = theme === 'dark';
    this.iconMoonTarget.classList.toggle('hidden', isDark);
    this.iconSunTarget.classList.toggle('hidden', !isDark);
  }
}
