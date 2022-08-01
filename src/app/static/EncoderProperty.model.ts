export type EncoderProperty = string | number | boolean | {[key: string]: EncoderProperty};

export type EncoderPropertyObject = {
  [key: string]: EncoderProperty
}

export type OptionsModel = {
  name: string;
  value: EncoderProperty;
  sign: string;
}
