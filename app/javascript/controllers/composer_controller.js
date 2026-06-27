import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['textarea', 'submit', 'hint', 'wrapper'];

  connect() {
    this.resize();
    this.updateState();

    requestAnimationFrame(() => {
      this.textareaTarget.focus();
    });
  }

  resize() {
    const textarea = this.textareaTarget;

    textarea.style.height = '0px';

    const maxHeight = 180;

    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';

    this.updateState();
  }

  updateState() {
    const empty = this.textareaTarget.value.trim() === '';

    this.wrapperTarget.classList.toggle('rounded-full', empty);
    this.wrapperTarget.classList.toggle('rounded-3xl', !empty);

    this.hintTarget.classList.toggle(
      'hidden',
      empty || this.textareaTarget.scrollHeight < 40
    );

    this.submitTarget.disabled = empty;

    this.submitTarget.classList.toggle('bg-zinc-700', empty);
    this.submitTarget.classList.toggle('hover:bg-zinc-600', empty);

    this.submitTarget.classList.toggle('bg-pink-500', !empty);
    this.submitTarget.classList.toggle('hover:bg-pink-600', !empty);
  }

  submit(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (this.textareaTarget.value.trim() === '') return;

      this.element.requestSubmit();
    }
  }
}
