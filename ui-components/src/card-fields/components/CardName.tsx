import { FunctionalComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import {
  checkName,
  defaultNavigation,
  defaultInputState,
  navigateOnKeyDown,
} from "../utils";
import type {
  CardNameChangeEvent,
  CardNavigation,
  FieldValidity,
  InputState,
} from "../types";
import type { JSXInternal } from "preact/src/jsx";

type CardNameProps = {
  name?: string;
  ref?: () => void;
  type?: string;
  state?: InputState;
  className?: string;
  placeholder?: string;
  style?: JSXInternal.CSSProperties;
  maxLength?: number;
  navigation?: CardNavigation;
  allowNavigation?: boolean;
  onChange?: (nameEvent: CardNameChangeEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onValidityChange?: (validity: FieldValidity) => void;
};

export const CardName: FunctionalComponent<CardNameProps> = ({
  name = "name",
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
}) => {
  const [inputState, setInputState] = useState<InputState>({
    ...defaultInputState,
    ...state,
  });
  const { inputValue, keyStrokeCount, isValid, isPotentiallyValid } =
    inputState;

  useEffect(() => {
    const validity = checkName(inputValue);
    setInputState((newState) => ({ ...newState, ...validity }));
  }, [inputValue]);

  useEffect(() => {
    if (typeof onValidityChange === "function") {
      onValidityChange({ isValid, isPotentiallyValid });
    }
    if (allowNavigation && inputValue && isValid) {
      navigation.next();
    }
  }, [isValid, isPotentiallyValid]);

  const setNameValue = (event: Event): void => {
    const { value } = event.target as HTMLInputElement;

    setInputState({
      ...inputState,
      inputValue: value,
      maskedInputValue: value,
      keyStrokeCount: keyStrokeCount + 1,
    });

    if (typeof onChange === "function") {
      onChange({ event, cardName: value });
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
      //inputmode="string"
      ref={ref}
      type={type}
      className={className}
      placeholder={placeholder}
      value={inputValue}
      style={style}
      maxLength={maxLength}
      onKeyDown={onKeyDownEvent}
      onInput={setNameValue}
      onFocus={onFocusEvent}
      onBlur={onBlurEvent}
    />
  );
};
