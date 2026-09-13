import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['container', 'message'];

  connect() {
    this.showToast = this.showToast.bind(this);

    document.addEventListener('forge:toast', this.showToast);
  }

  disconnect() {
    document.removeEventListener('forge:toast', this.showToast);
  }

  showToast(event) {
    this.messageTarget.textContent = event.detail.message;

    this.containerTarget.classList.remove(
      'opacity-0',
      'translate-y-4',
      'pointer-events-none'
    );

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.containerTarget.classList.add(
        'opacity-0',
        'translate-y-4',
        'pointer-events-none'
      );
    }, 2200);
  }
}
