// import {options} from '../models/options.enum';

export type Nullable<T> = T | null;

export function pickById(id: string): Nullable<HTMLElement> {
  return document.getElementById(id);
}

/*
 * Convert string to number OR boolean string to boolean value
 */
export function parseValue(value: number | boolean | string){
  if( value === 'true' ) {
    return true;
  } else if( value === 'false' ) {
    return false;
  }

  // Must be a string
  if (isNaN(<number>value)) {
    return value;
  }

  // Probably a number
  const cleanNum = parseFloat(('' + value).replace(/[^\d.-]/g, ''));
  return isNaN(cleanNum) ? 0 : cleanNum;
}
