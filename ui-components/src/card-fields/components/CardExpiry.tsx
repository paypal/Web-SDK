import { FunctionalComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import {
  formatDate,
  checkExpiry,
  removeNonDigits,
  removeDateMask,
  defaultNavigation,
  defaultInputState,
  navigateOnKeyDown,
  moveCursor,
} from "../utils";
import type {
  CardExpiryChangeEvent,
  CardNavigation,
  FieldValidity,
  InputState,
  InputEvent,
} from "../types";

type CardExpiryProps = {
  name?: string;
  autocomplete?: string;
  ref?: () => void;
  type?: string;
  state?: InputState;
  className?: string;
  placeholder?: string;
  style?: any;
  maxLength?: number;
  navigation?: CardNavigation;
  allowNavigation?: boolean;
  onChange?: (expiryEvent: CardExpiryChangeEvent) => void;
  onFocus?: (event: InputEvent) => void;
  onBlur?: (event: InputEvent) => void;
  onValidityChange?: (validity: FieldValidity) => void;
};

export const CardExpiry: FunctionalComponent<CardExpiryProps> = ({
  name = "expiry",
  autocomplete = "cc-exp",
  navigation = defaultNavigation,
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
  allowNavigation = false,
}: CardExpiryProps) => {
  const [inputState, setInputState] = useState<InputState>({
    ...defaultInputState,
    ...state,
  });
  const {
    inputValue,
    maskedInputValue,
    keyStrokeCount,
    isValid,
    isPotentiallyValid,
    contentPasted,
  } = inputState;

  useEffect(() => {
    const validity = checkExpiry(maskedInputValue);
    setInputState((newState) => ({ ...newState, ...validity }));
  }, [inputValue, maskedInputValue]);

  useEffect(() => {
    if (typeof onValidityChange === "function") {
      onValidityChange({ isValid, isPotentiallyValid });
    }

    if (allowNavigation && maskedInputValue && isValid) {
      navigation.next();
    }
  }, [isValid, isPotentiallyValid]);

  const setDateMask: any = (event: InputEvent): void => {
    const { value: rawValue, selectionStart, selectionEnd } = event.target;
    const value = removeNonDigits(rawValue);
    const mask = formatDate(value, rawValue);

    let startCursorPosition = selectionStart;
    let endCursorPosition = selectionEnd;

    if (mask.trim().slice(-1) === "/" || contentPasted) {
      startCursorPosition = mask.length;
      endCursorPosition = mask.length;
    }

    moveCursor(event.target, startCursorPosition, endCursorPosition);

    setInputState({
      ...inputState,
      inputValue: rawValue,
      maskedInputValue: mask,
      contentPasted: false,
      keyStrokeCount: keyStrokeCount + 1,
    });

    if (typeof onChange === "function") {
      onChange({ event, date: value, maskedDate: mask });
    }
  };

  const onKeyDownEvent: any = (event: InputEvent): void => {
    const {
      target: { value },
      key,
    } = event;

    const last = value.trim().slice(-1);
    if (last === "/" && key === "Backspace") {
      const month = removeDateMask(value);
      setInputState({
        ...inputState,
        inputValue: value,
        maskedInputValue: month,
      });
    }

    if (allowNavigation) {
      navigateOnKeyDown(event, navigation);
    }
  };

  const onFocusEvent: any = (event: InputEvent): void => {
    if (typeof onFocus === "function") {
      onFocus(event);
    }
    if (!isValid) {
      setInputState((newState) => ({ ...newState, isPotentiallyValid: true }));
    }
  };

  const onBlurEvent: any = (event: InputEvent): void => {
    if (typeof onBlur === "function") {
      onBlur(event);
    }
    if (!isValid) {
      setInputState((newState) => ({
        ...newState,
        isPotentiallyValid: false,
        contentPasted: false,
      }));
    }
  };

  const onPasteEvent: any = (): void => {
    setInputState((newState) => ({ ...newState, contentPasted: true }));
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
      value={maskedInputValue}
      style={style}
      maxLength={maxLength}
      onKeyDown={onKeyDownEvent}
      onInput={setDateMask}
      onFocus={onFocusEvent}
      onBlur={onBlurEvent}
      onPaste={onPasteEvent}
    />
  );
};
