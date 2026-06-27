import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['copyIcon', 'checkIcon'];

  static values = {
    text: String,
  };

  async copy() {
    await navigator.clipboard.writeText(this.textValue);

    this.copyIconTarget.classList.add('hidden');
    this.checkIconTarget.classList.remove('hidden');

    document.dispatchEvent(
      new CustomEvent('forge:toast', {
        detail: {
          message: 'Copied to clipboard',
        },
      })
    );

    setTimeout(() => {
      this.checkIconTarget.classList.add('hidden');
      this.copyIconTarget.classList.remove('hidden');
    }, 1200);
  }
}
