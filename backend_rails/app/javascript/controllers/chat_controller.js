import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['messages', 'composer'];

  connect() {
    requestAnimationFrame(() => {
      this.scrollBottom();
      this.focusComposer();
    });
  }

  scrollBottom() {
    if (!this.hasMessagesTarget) return;

    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight;
  }

  focusComposer() {
    if (!this.hasComposerTarget) return;

    const textarea = this.composerTarget.querySelector('textarea');

    if (textarea) textarea.focus();
  }
}
