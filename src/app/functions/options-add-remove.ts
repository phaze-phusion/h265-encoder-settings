import {EncoderPropertyObject} from '../static/EncoderProperty.model';

export function app_optionsAddRemove(
  options: EncoderPropertyObject,
  baseSetValue: string,
  removeSetValue: string,
  h265ArgumentsBase: { [key: string]: EncoderPropertyObject }
): EncoderPropertyObject {
  const crf_or_2pass: string = typeof options['crf'] !== 'undefined' ? 'crf' : '2pass';

  // Add base options in order to not change it with the following steps
  if (baseSetValue !== 'none') {
    let baseOptions: EncoderPropertyObject = Object.assign({}, h265ArgumentsBase[baseSetValue]);
    baseOptions = _assignAntiFormOptions(baseOptions, crf_or_2pass);
    options = app_uniteObjects(baseOptions, options, true);
  }

  // Create an intersect-set with the selected options
  if (removeSetValue !== 'none') {
    // duplicate the 'base' options for the chosen set
    let intersectedOptions: EncoderPropertyObject = Object.assign({}, h265ArgumentsBase[removeSetValue]);

    // add the 'remove' options
    intersectedOptions = Object.assign(intersectedOptions, h265ArgumentsBase[removeSetValue]);
    intersectedOptions = _assignAntiFormOptions(intersectedOptions, crf_or_2pass);

    options = app_intersectObjects(intersectedOptions, options);
  }

  return options;
}

function _assignAntiFormOptions(options: EncoderPropertyObject, crf_or_2pass: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  options['vbv-bufsize'] = options['vbv-bufsize'][crf_or_2pass];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  options['vbv-maxrate'] = options['vbv-maxrate'][crf_or_2pass];

  return options;
}

/*
   * Unite properties of one object with another object (Union of Sets)
   *
   * @param {object}  presetDefaults     Object with properties that will be the default values
   * @param {object}  incomingProperties Object with properties that will change the default when specified
   * @param {boolean} discardAdditional  Properties in incomingProperties that are not in presetDefaults will be discarded
   *
   * @return {object}
   */
function app_uniteObjects(
  presetDefaults: EncoderPropertyObject,
  incomingProperties: EncoderPropertyObject,
  discardAdditional: boolean
): EncoderPropertyObject {
  if (discardAdditional) {
    // Return all properties of presetDefaults only
    for (const property in presetDefaults) {
      if (typeof incomingProperties[property] !== 'undefined') {
        presetDefaults[property] = incomingProperties[property];
      }
    }
    return presetDefaults;
  } else {
    //Return all properties of presetDefaults as well as any others from incomingProperties
    for (const property in presetDefaults) {
      if (typeof incomingProperties[property] === 'undefined') {
        incomingProperties[property] = presetDefaults[property];
      }
    }
    return incomingProperties;
  }
}

/*
 * Intersect properties of one object with another object (Intersection of Sets)
 *
 * @param {object}  presetDefaults     Object with properties that will be the default values
 * @param {object}  incomingProperties Object with properties that will change the default when specified
 *
 * @return {object}
 */
function app_intersectObjects(
  presetDefaults: EncoderPropertyObject,
  incomingProperties: EncoderPropertyObject): EncoderPropertyObject {
  const emptyObject: EncoderPropertyObject = {};

  // // Sometimes it may miss a few options, this is to debug that list
  // const logSkippedOptions = false;
  // const padString = (str: string, emptyPaddedValue = '                  :') => {
  //   if (str.length >= emptyPaddedValue.length)
  //     return str;
  //   else
  //     return String(str + emptyPaddedValue.substring(str.length));
  // };

  for (const property in incomingProperties) {
    if (typeof presetDefaults[property] !== 'undefined') {
      if (incomingProperties[property] !== presetDefaults[property]) {
        emptyObject[property] = incomingProperties[property];
      }
      // else if (logSkippedOptions)
      //   console.log(padString(property), presetDefaults[property]);
    }
  }

  return emptyObject;
}
