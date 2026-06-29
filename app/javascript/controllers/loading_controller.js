import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['content', 'skeleton', 'submit'];

  connect() {
    this.hideSkeleton();
  }

  submit() {
    this.showSkeleton();

    if (this.hasSubmitTarget) {
      this.submitTarget.disabled = true;
    }
  }

  show() {
    this.showSkeleton();
  }

  hide() {
    this.hideSkeleton();
  }

  showSkeleton() {
    if (this.hasSkeletonTarget) {
      this.skeletonTarget.classList.remove('hidden');
    }

    if (this.hasContentTarget) {
      this.contentTarget.classList.add('hidden');
    }
  }

  hideSkeleton() {
    if (this.hasSkeletonTarget) {
      this.skeletonTarget.classList.add('hidden');
    }

    if (this.hasContentTarget) {
      this.contentTarget.classList.remove('hidden');
    }

    if (this.hasSubmitTarget) {
      this.submitTarget.disabled = false;
    }
  }
}
