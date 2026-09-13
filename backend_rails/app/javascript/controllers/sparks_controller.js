import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['content', 'icon'];

  connect() {
    this.open = false;
  }

  toggle() {
    this.open = !this.open;

    this.contentTarget.classList.toggle('hidden');

    this.iconTarget.classList.toggle('rotate-180');
  }
}
