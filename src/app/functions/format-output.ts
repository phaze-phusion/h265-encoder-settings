import {EncoderProperty, OptionsModel} from '../static/EncoderProperty.model';
import {app_sortOptions} from './sort-options';
import {app_meConversion} from './convert-me-values';
import {app_specialCasesFormats} from './format-special-cases';

export function app_formatOutput(
  optionsArray: OptionsModel[],
  order: string,
  format: string,
  h265ArgumentsOrder: string[],
  h265PropertiesFormat: { [key: string]: string[] }
): {signs: OptionsModel[], divider: string} {
  optionsArray = app_sortOptions(optionsArray, order, h265ArgumentsOrder);

  let signage: ((prop: string, val: EncoderProperty, valType: string) => string);
  let _divider: string;

  switch (format) {
    case 'handbrake':
      signage = (prop, val, valType) => {
        if (valType === 'boolean') {
          val = (val === true || val === 1 || val === 'true');
          return val ? prop : 'no-' + prop + '=1';
        }
        return prop + '=' + val;
      };
      _divider = ':';
      break;
    case 'json':
      signage = function (prop, val, valType) {
        prop = '"' + prop + '"';
        if (valType === 'boolean' || valType === 'number')
          return prop + ':' + val;
        return prop + ':' + '"' + val + '"';
      };
      _divider = ',';
      break;
    case 'tab':
      signage = function (prop, val, valType) {
        if (valType === 'boolean')
          val = val ? 'TRUE' : 'FALSE';
        return prop + "\t" + val;
      };
      _divider = "\n";
      break;
    case 'mediainfo':
      signage = function (prop, val, valType) {
        if (valType === 'boolean')
          return val ? prop : 'no-' + prop;
        return prop + '=' + val;
      };
      _divider = ' / ';
      break;
    case 'cli':
    default:
      signage = function (prop, val, valType) {
        if (valType === 'boolean')
          return '--' + (val ? prop : 'no-' + prop);
        else if (valType === 'number' || valType === 'string')
          return '--' + prop + ' ' + val;
        else
          return '--' + prop;
      };
      _divider = ' ';
  }

  for (let ostrich = 0; ostrich < optionsArray.length; ostrich++) {
    const item = optionsArray[ostrich];

    if (item.name === 'me') {
      const stax = (order === 'staxrip' && format !== 'tab');
      item.value = app_meConversion(item.value, !stax);
      item.sign = signage(item.name, item.value, stax ? 'string' : 'number');
    } else if (h265PropertiesFormat.str_num.indexOf(item.name) !== -1) {
      const strNumType = isNaN(<number>item.value) ? 'string' : 'number';
      item.sign = signage(item.name, item.value, strNumType);
    } else if (h265PropertiesFormat.no_able.indexOf(item.name) !== -1) {
      if (item.name === 'recursion-skip') {
        item.name = 'rskip';
      }
      item.sign = signage(item.name, item.value, 'boolean');
    } else if (h265PropertiesFormat.strange.indexOf(item.name) !== -1) {
      const specialCase = app_specialCasesFormats(item.name, item.value, format);
      item.sign = (specialCase.v === null) ? '' : signage(item.name, specialCase.v, specialCase.t);
    } else {
      item.sign = signage(item.name, item.value, 'number');
    }

  }

  return {
    signs: optionsArray,
    divider: _divider
  };
}
