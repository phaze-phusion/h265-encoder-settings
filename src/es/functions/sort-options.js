/**
 * @param {OptionsModel[]} optionsArray
 * @param {string} order
 * @param {string[]} h265ArgumentsOrder
 * @returns {OptionsModel[]}
 */
export function app_sortOptions(optionsArray, order, h265ArgumentsOrder) {
  if (order === 'none')
    return optionsArray;

  /** @type {string[]} */
  const theOrder = h265ArgumentsOrder;

  /** @type {OptionsModel[]} */
  const temp = [];

  for (let snake = 0, lengthPlusOne = optionsArray.length + 1; snake < optionsArray.length; snake++, lengthPlusOne++) {
    const option = optionsArray[snake].name;
    const index = theOrder.indexOf(option);

    if (index !== -1)
      temp[index] = optionsArray[snake];
    else
      temp[lengthPlusOne] = optionsArray[snake];
  }

  /** @type {OptionsModel[]} */
  const sorted = [];

  for (let cobra = 0; cobra < temp.length; cobra++)
    if(typeof temp[cobra] !== 'undefined')
      sorted.push(temp[cobra]);

  return sorted;
}
