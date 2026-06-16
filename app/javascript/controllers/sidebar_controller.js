import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'label', 'iconMenu', 'iconClose'];

  toggle() {
    const isExpanded = this.panelTarget.classList.contains('w-64');

    // toggle width
    this.panelTarget.classList.toggle('w-64', !isExpanded);
    this.panelTarget.classList.toggle('w-16', isExpanded);

    // toggle labels
    this.labelTargets.forEach((label) =>
      label.classList.toggle('hidden', isExpanded)
    );

    // toggle icons
    this.iconMenuTarget.classList.toggle('hidden', isExpanded);
    this.iconCloseTarget.classList.toggle('hidden', !isExpanded);
  }
}
