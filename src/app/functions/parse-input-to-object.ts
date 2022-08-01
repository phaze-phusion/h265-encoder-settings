import {parseValue} from './utlis';
import {EncoderPropertyObject} from '../static/EncoderProperty.model';

function app_parseInputToObject(text: string, splitter: string, equal: string): EncoderPropertyObject {
  const sections = text.split(splitter);
  const options: EncoderPropertyObject = {};

  for (let baboon = 0; baboon < sections.length; baboon++) {
    sections[baboon] = sections[baboon].trim();

    if (sections[baboon].length === 0) {
      continue;
    }

    const sub3isNo = sections[baboon].substring(0, 3) === 'no-';
    const hasEqual = sections[baboon].indexOf(equal) !== -1;
    const properties = sections[baboon].split(equal);

    if (sub3isNo && hasEqual) {
      // This caters for HandBrake weirdness where one disables a property like no-rect=1
      options[properties[0].substring(3)] = parseValue(properties[1]) !== 1;
    } else if (hasEqual) {
      options[properties[0]] = parseValue(properties[1]);
    } else if (sub3isNo) {
      options[sections[baboon].substring(3)] = false;
    } else {
      options[sections[baboon]] = true;
    }
  }

  return options;
}

export function app_inputToObject(value: string): EncoderPropertyObject {
  let options: EncoderPropertyObject = {};

  // Input is MediaInfo
  if (value.indexOf('/') !== -1) {
    options = app_parseInputToObject(value, '/', '=');
  }
  // Input is CLI
  else if (value.indexOf('--') !== -1) {
    options = app_parseInputToObject(value, '--', ' ');
  }
  // Input is Tabular (possibly from Excel)
  else if (value.indexOf('\t') !== -1 && value.indexOf('\n') !== -1) {
    options = app_parseInputToObject(value.toLowerCase(), '\n', '\t');
  }
  // Input is Handbrake
  else if (value.indexOf(':') !== -1 && value.indexOf('=') !== -1) {
    options = app_parseInputToObject(value, ':', '=');
  }

  // Format some propertys values

  if (typeof options['level-idc'] !== 'undefined') {
    const val = parseFloat(<string>options['level-idc']);
    options['level-idc'] = (val > 10) ? val / 10 : val;
  }

  if (typeof options['scenecut-bias'] !== 'undefined') {
    const val = parseFloat(<string>options['scenecut-bias']);
    options['scenecut-bias'] = (val <= 1) ? val * 100 : val;
  }

  return options;
}
