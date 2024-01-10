/**
 * @typedef {(T | null)} Nullable<T>
 */

/**
 * @typedef {(string | number | boolean | {[key: string]: EncoderProperty})} EncoderProperty
 */

/**
 * @typedef {{[key: string]: EncoderProperty}} EncoderPropertyObject
 */

/**
 * @typedef {Object} OptionsModel
 * @property {string} name
 * @property {EncoderProperty} value
 * @property {string} sign
 */


/** @typedef {{v: boolean, t: 'boolean'}} ValType_boolean */
/** @typedef {{v: string, t: 'string'}} ValType_string */
/** @typedef {{v: number, t: 'number'}} ValType_number */
/** @typedef {{v: null, t: 'null'}} ValType_null */
/** @typedef {(ValType_boolean | ValType_string | ValType_number | ValType_null)} ValTypeObject */

/**
 * @typedef {Object} H265ArgumentsModel
 * @property {{[key: string]: EncoderPropertyObject}} base
 * @property {{[key: string]: string[]}} order
 * @property {{[key: string]: {[key: string]: (number | string | boolean)}}} remove
 */

/**
 * @typedef {{format: {no_able: string[], str_num: string[], strange: string[]}}} H265PropertiesModel
 */

/**
 * @typedef {{signs: OptionsModel[], divider: string}} SignsDividerModel
 */

/**
 * @typedef {Function} SignageFunction
 * @param {string} prop
 * @param {EncoderProperty} val
 * @param {string} valType
 * @returns {string}
 */
