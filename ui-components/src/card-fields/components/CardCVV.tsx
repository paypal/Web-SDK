import { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import type CSS from "csstype";

import {
  checkCVV,
  removeNonDigits,
  defaultNavigation,
  defaultInputState,
  navigateOnKeyDown,
} from "../utils";
import type {
  CardType,
  CardCvvChangeEvent,
  CardNavigation,
  FieldValidity,
  InputState,
} from "../types";
import type { JSXInternal } from "preact/src/jsx";

type CardCvvProps = {
  name?: string;
  autocomplete?: string;
  ref?: () => void;
  type: string;
  state?: InputState;
  className?: string;
  placeholder?: string;
  style?: JSXInternal.CSSProperties;
  maxLength?: number;
  cardType?: CardType;
  navigation?: CardNavigation;
  allowNavigation?: boolean;
  onChange?: (cvvEvent: CardCvvChangeEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onValidityChange?: (validity: FieldValidity) => void;
};

export const CardCVV: FunctionalComponent<CardCvvProps> = ({
  name = "cvv",
  autocomplete = "cc-csc",
  navigation = defaultNavigation,
  allowNavigation = false,
  state,
  ref,
  type,
  className,
  placeholder,
  style,
  maxLength,
  onChange,
  onFocus,
  onBlur,
  onValidityChange,
  cardType,
}: CardCvvProps) => {
  const [inputState, setInputState] = useState<InputState>({
    ...defaultInputState,
    ...state,
  });
  const { inputValue, keyStrokeCount, isValid, isPotentiallyValid } =
    inputState;

  useEffect(() => {
    if (cardType) {
      const validity = checkCVV(inputValue, cardType);
      setInputState((newState) => ({ ...newState, ...validity }));
    }
  }, [inputValue]);

  useEffect(() => {
    if (typeof onValidityChange === "function") {
      onValidityChange({ isValid, isPotentiallyValid });
    }
    if (allowNavigation && inputValue && isValid) {
      navigation.next();
    }
  }, [isValid, isPotentiallyValid]);

  const setCvvValue = (event: Event): void => {
    const rawValue = (event.target as HTMLInputElement).value || "";
    const value = removeNonDigits(rawValue);

    setInputState({
      ...inputState,
      inputValue: value,
      maskedInputValue: value,
      keyStrokeCount: keyStrokeCount + 1,
    });

    if (typeof onChange === "function") {
      onChange({ event, cardCvv: value });
    }
  };

  const onKeyDownEvent = (event: KeyboardEvent): void => {
    if (allowNavigation) {
      navigateOnKeyDown(event, navigation);
    }
  };

  const onFocusEvent = (event: FocusEvent): void => {
    if (typeof onFocus === "function") {
      onFocus(event);
    }
    if (!isValid) {
      setInputState((newState) => ({ ...newState, isPotentiallyValid: true }));
    }
  };

  const onBlurEvent = (event: FocusEvent): void => {
    if (typeof onBlur === "function") {
      onBlur(event);
    }
    if (!isValid) {
      setInputState((newState) => ({ ...newState, isPotentiallyValid: false }));
    }
  };

  return (
    <input
      name={name}
      autocomplete={autocomplete}
      //inputmode="numeric"
      ref={ref}
      type={type}
      className={className}
      placeholder={placeholder}
      value={inputValue}
      style={style}
      maxLength={maxLength}
      onKeyDown={onKeyDownEvent}
      onInput={setCvvValue}
      onFocus={onFocusEvent}
      onBlur={onBlurEvent}
    />
  );
};
