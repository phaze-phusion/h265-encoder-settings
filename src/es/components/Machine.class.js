import {pickById} from '../functions/utlis';
import {elementId} from '../static/elementId.enum';
import {app_inputToObject} from '../functions/parse-input-to-object';
import {RadioGroupClass} from './RadioGroup.class';
import {h265Arguments} from '../static/h265-arguments';
import {h265Properties} from '../static/h265-properties';
import {app_formatOutput} from '../functions/format-output';
import {app_optionsAddRemove} from '../functions/options-add-remove';

export class MachineClass {

  /**
   * @type {HTMLTextAreaElement}
   * @private
   */
  _inputTextarea;

  /**
   * @type {HTMLTextAreaElement}
   * @private
   */
  _outputTextarea;

  /**
   * @type {EncoderPropertyObject}
   * @private
   */
  _options = {};

  /**
   * @type {RadioGroupClass}
   * @private
   */
  _radioBaseSet;

  /**
   * @type {RadioGroupClass}
   * @private
   */
  _radioRemoveSet;

  /**
   * @type {RadioGroupClass}
   * @private
   */
  _radioOutFormat;

  /**
   * @type {RadioGroupClass}
   * @private
   */
  _radioOutOrder;

  /**
   * @type {H265ArgumentsModel}
   * @private
   */
  static _h265Arguments = h265Arguments;

  /**
   * @type {H265PropertiesModel}
   * @private
   */
  static _h265Properties = h265Properties;

  constructor() {
    this._inputTextarea = pickById(elementId.encoderInput);
    this._outputTextarea = pickById(elementId.encoderOutput);
    this._radioBaseSet = new RadioGroupClass(elementId.radioGroupSetBase);
    this._radioRemoveSet = new RadioGroupClass(elementId.radioGroupSetRemove);
    this._radioOutFormat = new RadioGroupClass(elementId.radioGroupOutFormat);
    this._radioOutOrder = new RadioGroupClass(elementId.radioGroupOutOder);
    this._options = {};
  }

  convert() {
    const value = this._inputTextarea.value;
    const order = this._radioOutOrder.value;
    const format = this._radioOutFormat.value;
    const baseSet = this._radioBaseSet.value;
    const removeSet = this._radioRemoveSet.value;

    if (value.trim().length === 0) {
      this._outputTextarea.value = 'Error: No input supplied';
      return;
    }

    this._options = app_inputToObject(value);
    this._options = app_optionsAddRemove(this._options, baseSet, removeSet, MachineClass._h265Arguments.base);

    /** @type {OptionsModel[]} */
    const optionsArr = [];

    // Convert options object into name-value pairs within an array
    for (const item in this._options)
      optionsArr.push({
        name: item,
        value: this._options[item],
        sign: '',
      });

    const out_obj = app_formatOutput(optionsArr, order, format, MachineClass._h265Arguments.order[order], MachineClass._h265Properties.format);
    const divider = out_obj.divider;
    const signs = out_obj.signs;
    let out_print = '';

    for (let elephant = 0; elephant < signs.length; elephant++) {
      if (typeof signs[elephant].sign === 'undefined')
        console.log(signs[elephant]);

      // do not add empty signs
      if (signs[elephant].sign.trim() === '')
        continue;

      out_print += signs[elephant].sign + divider;
    }

    // remove trailing divider
    out_print = out_print.substring(0, out_print.length - divider.length);

    this._outputTextarea.value = out_print;
  }
}
