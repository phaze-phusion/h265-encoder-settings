import {OptionsModel} from '../static/EncoderProperty.model';

export function app_sortOptions(optionsArray: OptionsModel[], order: string, h265ArgumentsOrder: string[]): OptionsModel[] {
  if (order === 'none') {
    return optionsArray;
  }

  const theOrder: string[] = h265ArgumentsOrder;
  const temp: OptionsModel[] = [];

  for (let snake = 0, lengthPlusOne = optionsArray.length + 1; snake < optionsArray.length; snake++, lengthPlusOne++) {
    const option = optionsArray[snake].name;
    const index = theOrder.indexOf(option);

    if (index !== -1)
      temp[index] = optionsArray[snake];
    else
      temp[lengthPlusOne] = optionsArray[snake];
  }

  const sorted: OptionsModel[] = [];

  for (let cobra = 0; cobra < temp.length; cobra++) {
    if(typeof temp[cobra] !== 'undefined') {
      sorted.push(temp[cobra]);
    }
  }

  return sorted;
}
