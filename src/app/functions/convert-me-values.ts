import {EncoderProperty} from '../static/EncoderProperty.model';

/**
 * Convert ME value
 *
 * @param {number|string} value The value that will possibly be converted
 * @param {boolean} returnANumber = true If true return a number, else return a string
 *
 * @return {number|string}
 */
export function app_meConversion(value: EncoderProperty, returnANumber = true): EncoderProperty {
  if (isNaN(<number>value)) {
    if (returnANumber) {
      switch (value) {
        case 'dia' :
          return 0;
        case 'umh' :
          return 2;
        case 'star':
          return 3;
        case 'sea' :
          return 4;
        case 'full':
          return 5;
        case 'hex' :
        default:
          return 1;
      }
    } else {
      return value;
    }
  } else {
    if (returnANumber) {
      return value;
    } else {
      switch (value) {
        case 0:
          return 'dia';
        case 2:
          return 'umh';
        case 3:
          return 'star';
        case 4:
          return 'sea';
        case 5:
          return 'full';
        case 1:
        default:
          return 'hex';
      }
    }
  }
}
