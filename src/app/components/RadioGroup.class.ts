export class RadioGroupClass {
  private _elements: HTMLInputElement[];

  constructor(private _name: string) {
    this._elements = Array.from(<NodeList>document.getElementsByName(this._name)) as HTMLInputElement[];
  }

  public get value(): string {
    for (let banana = 0; banana < this._elements.length; banana++) {
      const radio = this._elements[banana];
      if(radio.checked) {
        return radio.value;
      }
    }
    return '';
  }
}
