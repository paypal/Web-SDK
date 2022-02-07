export type SetupCardOptions = {
  cspNonce: string;
  facilitatorAccessToken: string;
};

export type Card = {
  number: string;
  cvv?: string;
  expiry?: string;
  name?: string;
};

export type FieldStyle = {
  height?: string;
  width?: string;
  color?: string;
  border?: string;
  borderTop?: string;
  borderLeft?: string;
  borderBottom?: string;
  borderRight?: string;
  display?: string;
  backgroundColor?: string;
  background?: string;
  appearance?: string;
  boxShadow?: string;
  direction?: string;
  font?: string;
  fontFamily?: string;
  fontSizeAdjust?: string;
  fontSize?: string;
  fontStretch?: string;
  fontStyle?: string;
  fontVariantAlternates?: string;
  fontVariantCaps?: string;
  fontVariantEastAsian?: string;
  fontVariantLigatures?: string;
  fontVariantNumeric?: string;
  fontVariant?: string;
  fontWeight?: string;
  letterSpacing?: string;
  lineHeight?: string;
  opacity?: string;
  outline?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  textAlign?: string;
  textShadow?: string;
  transition?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type CardStyle = {};

export type CardPlaceholder = {
  number?: string;
  expiry?: string;
  cvv?: string;
  name?: string;
};

export type CardType = {
  gaps: Array<number>;
  lengths: Array<number>;
  patterns: Array<number>;
  type: string;
  niceType: string;
  code: {
    name: string;
    size: number;
  };
};

export type CardNumberChangeEvent = {
  event: Event;
  cardNumber: string;
  cardMaskedNumber: string;
  cardType: CardType;
};

export type CardExpiryChangeEvent = {
  event: Event;
  maskedDate: string;
  date: string;
};

export type CardCvvChangeEvent = {
  event: Event;
  cardCvv: string;
};

export type CardNameChangeEvent = {
  event: Event;
  cardName: string;
};

export type FieldValidity = {
  isValid: boolean;
  isPotentiallyValid: boolean;
};

export type CardNavigation = {
  next: () => void;
  previous: () => void;
};

export type InputState = {
  inputValue: string;
  maskedInputValue: string;
  cursorStart: number;
  cursorEnd: number;
  keyStrokeCount: number;
  isPotentiallyValid: boolean;
  isValid: boolean;
  contentPasted?: boolean;
};

export type InputOptions = {
  inputState: InputState;
  validationFn: () => unknown;
};

export type ExtraFields = {
  billingAddress?: string;
};
