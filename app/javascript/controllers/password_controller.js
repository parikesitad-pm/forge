import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = [
    'input',
    'length',
    'uppercase',
    'lowercase',
    'number',
    'symbol',
  ];

  validate() {
    const value = this.inputTarget.value;

    this.toggle(this.lengthTarget, value.length >= 8);
    this.toggle(this.uppercaseTarget, /[A-Z]/.test(value));
    this.toggle(this.lowercaseTarget, /[a-z]/.test(value));
    this.toggle(this.numberTarget, /\d/.test(value));
    this.toggle(this.symbolTarget, /[!@#$%^&*]/.test(value));
  }

  toggle(element, valid) {
    element.classList.remove('text-red-400', 'text-emerald-400');

    element.classList.add(valid ? 'text-emerald-400' : 'text-red-400');

    element.querySelector('.status').textContent = valid ? '✓' : '○';
  }
}
