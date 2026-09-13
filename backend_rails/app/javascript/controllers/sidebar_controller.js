import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'label'];

  toggle() {
    const collapsed = this.panelTarget.classList.contains('w-16');

    if (collapsed) {
      this.panelTarget.classList.remove('w-16');
      this.panelTarget.classList.add('w-64');

      this.labelTargets.forEach((label) => {
        label.classList.remove('hidden');
      });
    } else {
      this.panelTarget.classList.remove('w-64');
      this.panelTarget.classList.add('w-16');

      this.labelTargets.forEach((label) => {
        label.classList.add('hidden');
      });
    }
  }
}
