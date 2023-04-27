import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateNameInput(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const name = control.value;
    if (name.trim().length === 0) {
      return null;
    }

    const namePattern = /^[a-zA-Z\u00C7\u00E7\s]*$/;
    if (control.value && !namePattern.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  };
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;
    if (!cpf) {
      return null;
    }
    const cleanedCpf = cpf.replace(/[^\d]/g, '');
    if (cleanedCpf.length !== 11) {
      return { invalidCpf: true };
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCpf.charAt(i)) * (10 - i);
    }
    let checkDigit1 = 11 - (sum % 11);
    if (checkDigit1 === 10 || checkDigit1 === 11) {
      checkDigit1 = 0;
    }
    if (checkDigit1 !== parseInt(cleanedCpf.charAt(9))) {
      return { invalidCpf: true };
    }
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCpf.charAt(i)) * (11 - i);
    }
    let checkDigit2 = 11 - (sum % 11);
    if (checkDigit2 === 10 || checkDigit2 === 11) {
      checkDigit2 = 0;
    }
    if (checkDigit2 !== parseInt(cleanedCpf.charAt(10))) {
      return { invalidCpf: true };
    }
    return null;
  };
}
