import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = [
    'modal',
    'backdrop',
    'icon',
    'title',
    'message',
    'confirmForm',
    'confirmButton',
  ];

  open(event) {
    event.preventDefault();

    const button = event.currentTarget.dataset;

    this.titleTarget.textContent = button.confirmTitle;
    this.messageTarget.textContent = button.confirmMessage;
    this.confirmButtonTarget.textContent = button.confirmButton;

    this.confirmFormTarget.action = button.confirmUrl;

    this.confirmFormTarget.querySelector('input[name="_method"]').value =
      button.confirmMethod;

    this.backdropTarget.classList.remove('hidden');
    this.modalTarget.classList.remove('hidden');

    requestAnimationFrame(() => {
      this.backdropTarget.classList.remove('opacity-0');

      this.modalTarget.classList.remove('opacity-0', 'scale-95');
    });

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.backdropTarget.classList.add('opacity-0');

    this.modalTarget.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
      this.backdropTarget.classList.add('hidden');
      this.modalTarget.classList.add('hidden');
    }, 200);

    document.body.classList.remove('overflow-hidden');
  }

  backdrop(event) {
    if (event.target === this.backdropTarget) {
      this.close();
    }
  }

  connect() {
    this.keyHandler = (event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    };

    document.addEventListener('keydown', this.keyHandler);
  }

  disconnect() {
    document.removeEventListener('keydown', this.keyHandler);
  }
}
