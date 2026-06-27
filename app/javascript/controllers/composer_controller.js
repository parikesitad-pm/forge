import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['textarea'];

  connect() {
    this.resize();
  }

  resize() {
    const textarea = this.textareaTarget;

    textarea.style.height = '0px';

    const maxHeight = 240;

    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  submit(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      this.element.requestSubmit();
    }
  }
}
