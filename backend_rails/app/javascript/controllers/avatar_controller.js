import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['input', 'preview', 'fallback'];

  preview() {
    const file = this.inputTarget.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    this.previewTarget.src = url;
    this.previewTarget.classList.remove('hidden');

    if (this.hasFallbackTarget) {
      this.fallbackTarget.classList.add('hidden');
    }
  }
}
