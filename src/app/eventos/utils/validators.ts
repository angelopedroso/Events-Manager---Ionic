import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export function addressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const address = control.value;
    if (address.trim().length === 0) {
      return null;
    }

    const regex = /^[A-Za-zÀ-ú0-9\s\,\.\-\/\(\)]+$/;
    if (address && !regex.test(address)) {
      return { invalidAddress: true };
    }
    return null;
  };
}

export function minSelectedCheckboxes(min = 1): ValidatorFn {
  const validator: ValidatorFn = (control: AbstractControl) => {
    const p = control.value;
    if (p.length === 0) {
      return null;
    }

    if (control instanceof FormArray) {
      const selectedCount = control.controls
        .map((control) => control.value)
        .reduce((prev, next) => (next ? prev + 1 : prev), 0);

      return selectedCount >= min ? null : { invalidParticipante: true };
    }
    return null;
  };

  return validator;
}
