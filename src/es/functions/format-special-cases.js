/**
 * @param {string} prop
 * @param {EncoderProperty} val
 * @param {string} format
 * @returns {ValTypeObject | {v: Nullable<EncoderProperty>, t: string}}
 */
export function app_specialCasesFormats(prop, val, format) {
  const booleanObject = {v: val, t: 'boolean'};
  const stringObject = {v: val, t: 'string'};
  const numberObject = {v: val, t: 'number'};
  const nullObject = {v: null, t: 'null'};

  switch (prop) {
    case 'profile' :
      return stringObject;
    case 'scenecut' :
      return (val === true || val === false || val === 0) ? booleanObject : numberObject;
    case 'deblock' :
      if (val === false)
        return booleanObject;
      else if (format === 'handbrake') {
        if ((val).indexOf(':') !== -1)
          return {v: (val).replace(':', ','), t: 'string'};
        else if (val === 0 || val === 1 || val === true)
          return booleanObject;
        else
          return stringObject;
      } else if (val === 0 || val === 1 || val === true)
        return {v: '0:0', t: 'string'};
      else //if( ( val + '' ).indexOf(':') !== -1 )
        return stringObject;
    case 'interlace' :
      if (val === false)
        return booleanObject;
      else if (val === 'tff' || val === 'bff')
        return stringObject;
      else
        return numberObject;
    case 'level-idc' :
      val = parseFloat(val);
      if (val > 10)
        val /= 10;
      return numberObject;
    case 'pass' :
      return (val === 1 || val === 2 || val === 3) ? numberObject : nullObject;
    case 'vbv-bufsize':
    case 'vbv-maxrate':
      return val === false ? nullObject : numberObject;
    case 'asm' :
      if (val === false)
        return booleanObject;
      else if (isNaN(val))
        return stringObject;
      else
        return nullObject;
    case 'scenecut-bias':
      val = (val < 1) ? val * 100 : val;
      return {v: val, t: 'number'};
    case 'chromaloc':
    case 'numa-pools':
    case 'sar':
      return ((val + '').length > 0) ? stringObject : nullObject;
    case 'max-cll' :
      return (val === '0,0' || val === 0) ? nullObject : stringObject;
    case 'range' :
      return (val === 'full' || val === 'limited') ? stringObject : nullObject;
    case 'overscan' :
      return (val === 'show' || val === 'crop') ? stringObject : nullObject;
    case 'dither' :
    case 'uhd-bd' :
      return (val === true) ? booleanObject : nullObject;
    case 'hash':
    case 'zone-count' :
      return (val === 0 || val === false) ? nullObject : numberObject;
    case 'dhdr10-opt' :
      return (val === true) ? booleanObject : nullObject;
    case 'display-window' : // h265 --display-window: https://x265.readthedocs.io/en/stable/cli.html#cmdoption-display-window
    case 'zones' : // h265 --zones: https://x265.readthedocs.io/en/stable/cli.html#cmdoption-zones
    default :
      return nullObject;
  }
}
