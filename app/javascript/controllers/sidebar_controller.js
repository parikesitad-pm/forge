import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'label', 'logoText', 'logoImage', 'iconMenu'];

  connect() {
    this.collapsed = false;
  }

  toggle() {
    this.collapsed = !this.collapsed;

    this.panelTarget.classList.toggle('w-64', !this.collapsed);
    this.panelTarget.classList.toggle('w-16', this.collapsed);

    this.labelTargets.forEach((label) => {
      label.classList.toggle('hidden', this.collapsed);
    });

    if (this.hasLogoTextTarget) {
      this.logoTextTarget.classList.toggle('hidden', this.collapsed);
    }
  }
}
