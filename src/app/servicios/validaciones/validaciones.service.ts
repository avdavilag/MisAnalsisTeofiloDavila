import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }


  // Validar solo letras
  validateOnlyLetters(event: any) {
    let hasOnlyLetters = false;

    if ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode == 32)) {
      hasOnlyLetters = true
    }
    return hasOnlyLetters
  }
  // validar solo números
  validateOnlyNumbers(event: any) {
    let hasOnlyNumbers = false;
    if ((event.charCode > 47 && event.charCode < 58)) {
      hasOnlyNumbers = true
    }
    return hasOnlyNumbers
  }

  // validar el email
  validateOnlyEmail(event: any) {
    let hasCorrectEmail = false;
    if ((event.charCode >= 46 && event.charCode < 58) || (event.charCode > 96 && event.charCode < 123) || (event.charCode == 64)
      || (event.charCode == 95)) {
      hasCorrectEmail = true
    }
    return hasCorrectEmail
  }

  // validar la dirección
  validateOnlyAddress(event: any) {
    let hasCorrectAddress = false;
    if ( (event.charCode > 47 && event.charCode < 58) || (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode == 32)
    || (event.charCode == 45)) {
      hasCorrectAddress = true
    }
    return hasCorrectAddress
  }

  // validar la dirección
  validateLettersNoSpace(event: any) {
    let hasLetterNoSpace  = false;
    if ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)) {
      hasLetterNoSpace  = true
    }
    return hasLetterNoSpace 
  }

    // validar el tipo de sangre
    validateBloodType(event: any) {
      let hasCorrectBloodType   = false;
      if ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode == 43) || (event.charCode == 45)) {
        hasCorrectBloodType   = true
      }
      return hasCorrectBloodType  
    }
}
