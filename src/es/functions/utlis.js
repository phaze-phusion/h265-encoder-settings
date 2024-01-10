/**
 * @param {string} id
 * @returns {HTMLElement}
 */
export function pickById(id) {
  return document.getElementById(id);
}

/**
 * Convert string to number OR boolean string to boolean value
 *
 * @param {number|boolean|string} value
 * @returns {number|boolean|string}
 */
export function parseValue(value){
  if(value === 'true' )
    return true;
  else if( value === 'false' )
    return false;

  // Must be a string
  if (isNaN(value))
    return value;

  // Probably a number
  const cleanNum = parseFloat(('' + value).replace(/[^\d.-]/g, ''));
  return isNaN(cleanNum) ? 0 : cleanNum;
}
