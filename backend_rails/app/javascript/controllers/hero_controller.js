import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['logo', 'title', 'subtitle', 'actions'];

  connect() {
    this.targets = [
      this.logoTarget,
      this.titleTarget,
      this.subtitleTarget,
      this.actionsTarget,
    ];

    this.targets.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-4');
    });

    this.targets.forEach((el, index) => {
      setTimeout(() => {
        el.classList.remove('opacity-0', 'translate-y-4');
        el.classList.add('opacity-100', 'translate-y-0');
      }, index * 180);
    });

    requestAnimationFrame(() => {
      const rect = this.logoTarget.getBoundingClientRect();

      document.body.dataset.heroX = rect.left + rect.width / 2;

      document.body.dataset.heroY = rect.top + rect.height / 2;
    });
  }
}
