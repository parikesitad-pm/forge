import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'label'];

  toggle() {
    this.panelTarget.classList.toggle('w-64');
    this.panelTarget.classList.toggle('w-20');

    this.labelTargets.forEach((label) => {
      label.classList.toggle('hidden');
    });
  }
}
