import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = [
    'input',
    'confirmation',
    'match',
    'matchText',
    'length',
    'uppercase',
    'lowercase',
    'number',
    'symbol',
  ];

  connect() {
    this.validate();
  }

  validate() {
    const password = this.inputTarget.value;

    this.toggle(this.lengthTarget, password.length >= 8);
    this.toggle(this.uppercaseTarget, /[A-Z]/.test(password));
    this.toggle(this.lowercaseTarget, /[a-z]/.test(password));
    this.toggle(this.numberTarget, /\d/.test(password));
    this.toggle(this.symbolTarget, /[!@#$%^&*(),.?":{}|<>]/.test(password));

    this.validateConfirmation();
  }

  validateConfirmation() {
    const password = this.inputTarget.value;
    const confirmation = this.confirmationTarget.value;

    if (confirmation.length === 0) {
      this.matchTarget.classList.remove('text-emerald-400', 'text-red-400');

      this.matchTarget.classList.add('text-zinc-500');

      this.matchTarget.querySelector('.status').textContent = '○';
      this.matchTextTarget.textContent = 'Waiting for confirmation';

      return;
    }

    const matched = password === confirmation;

    this.matchTarget.classList.remove(
      'text-zinc-500',
      'text-emerald-400',
      'text-red-400'
    );

    this.matchTarget.classList.add(
      matched ? 'text-emerald-400' : 'text-red-400'
    );

    this.matchTarget.querySelector('.status').textContent = matched ? '✓' : '✕';

    this.matchTextTarget.textContent = matched
      ? 'Passwords match'
      : 'Passwords do not match';
  }

  toggle(element, valid) {
    element.classList.remove('text-red-400', 'text-emerald-400');

    element.classList.add(valid ? 'text-emerald-400' : 'text-red-400');

    element.querySelector('.status').textContent = valid ? '✓' : '○';
  }
}
