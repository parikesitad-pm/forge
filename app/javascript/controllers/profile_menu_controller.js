import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['button', 'menu'];

  connect() {
    this.close = this.close.bind(this);
    this.escape = this.escape.bind(this);

    document.addEventListener('click', this.close);
    document.addEventListener('keydown', this.escape);
  }

  disconnect() {
    document.removeEventListener('click', this.close);
    document.removeEventListener('keydown', this.escape);
  }

  toggle(event) {
    event.stopPropagation();

    if (!this.menuTarget.classList.contains('hidden')) {
      this.menuTarget.classList.add('hidden');
      return;
    }

    this.menuTarget.classList.remove('hidden');

    requestAnimationFrame(() => {
      const button = this.buttonTarget.getBoundingClientRect();

      this.menuTarget.style.left = `${button.left}px`;

      this.menuTarget.style.top = `${
        button.top - this.menuTarget.offsetHeight - 8
      }px`;
    });
  }

  close(event) {
    if (!this.element.contains(event.target)) {
      this.menuTarget.classList.add('hidden');
    }
  }

  escape(event) {
    if (event.key === 'Escape') {
      this.menuTarget.classList.add('hidden');
    }
  }
}
