import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['menu'];

  connect() {
    this.outsideClick = this.close.bind(this);
  }

  toggle(event) {
    event.stopPropagation();

    this.menuTarget.classList.toggle('hidden');

    if (!this.menuTarget.classList.contains('hidden')) {
      document.addEventListener('click', this.outsideClick);
    } else {
      document.removeEventListener('click', this.outsideClick);
    }
  }

  close(event) {
    if (!this.element.contains(event.target)) {
      this.menuTarget.classList.add('hidden');
      document.removeEventListener('click', this.outsideClick);
    }
  }

  disconnect() {
    document.removeEventListener('click', this.outsideClick);
  }
}
