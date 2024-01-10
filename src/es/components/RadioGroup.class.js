export class RadioGroupClass {
  /**
   * @type {HTMLInputElement[]}
   * @private
   */
  _elements;

  /**
   * @type {string}
   * @private
   */
  _name;

  /**
   * @param {string} name
   */
  constructor(name) {
    this._name = name;
    this._elements = Array.from(document.getElementsByName(this._name));
  }

  /**
   * @returns {string}
   */
  get value() {
    for (let banana = 0; banana < this._elements.length; banana++) {
      const radio = this._elements[banana];
      if(radio.checked)
        return radio.value;
    }
    return '';
  }
}
