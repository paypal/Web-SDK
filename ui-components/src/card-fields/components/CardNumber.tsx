import { FunctionalComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import {
  maskCard,
  checkForNonDigits,
  removeNonDigits,
  detectCardType,
  checkCardNumber,
  moveCursor,
  defaultNavigation,
  defaultInputState,
  navigateOnKeyDown,
  maskValidCard,
} from "../utils";
import type {
  CardNavigation,
  InputState,
  CardNumberChangeEvent,
  FieldValidity,
} from "../types";
import type { JSXInternal } from "preact/src/jsx";
import { DEFAULT_CARD_TYPE } from "../constants";

// Helper method to check if navigation to next field should be allowed
function validateNavigation({
  allowNavigation,
  inputState,
}: {
  allowNavigation: boolean;
  inputState: InputState;
}): boolean {
  const { inputValue, isValid, maskedInputValue, cursorStart, contentPasted } =
    inputState;
  return Boolean(
    allowNavigation &&
      inputValue &&
      isValid &&
      (maskedInputValue.length === cursorStart || contentPasted)
  );
}

type CardNumberProps = {
  name?: string;
  type?: string;
  className?: string;
  placeholder?: string;
  style?: JSXInternal.CSSProperties;
  state?: InputState;
  ref?: () => void;
  autocomplete?: string;
  maxLength?: number;
  navigation?: CardNavigation;
  allowNavigation?: boolean;
  onChange?: (event: CardNumberChangeEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onValidityChange?: (validity: FieldValidity) => void;
};

export const CardNumber: FunctionalComponent<CardNumberProps> = ({
  name = "number",
  autocomplete = "cc-number",
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
  const [cardType, setCardType] = useState(DEFAULT_CARD_TYPE);
  const [inputState, setInputState] = useState({
    ...defaultInputState,
    ...state,
  });

  const {
    inputValue,
    maskedInputValue,
    cursorStart,
    cursorEnd,
    keyStrokeCount,
    isValid,
    isPotentiallyValid,
    contentPasted,
  } = inputState;

  useEffect(() => {
    const validity = checkCardNumber(inputValue, cardType);
    setInputState((newState: InputState) => ({ ...newState, ...validity }));
  }, [inputValue, maskedInputValue]);

  useEffect(() => {
    if (typeof onValidityChange === "function") {
      onValidityChange({ isValid, isPotentiallyValid });
    }

    if (validateNavigation({ allowNavigation, inputState })) {
      navigation.next();
    }
  }, [isValid, isPotentiallyValid]);

  const setValueAndCursor = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const { value: rawValue, selectionStart, selectionEnd } = target;
    const value = removeNonDigits(rawValue);
    const detectedCardType = detectCardType(value);
    const maskedValue = maskCard(value);

    let startCursorPosition = selectionStart;
    let endCursorPosition = selectionEnd;

    if (checkForNonDigits(rawValue)) {
      startCursorPosition = cursorStart;
      endCursorPosition = cursorEnd;
    }

    if (contentPasted) {
      startCursorPosition = maskedValue.length;
      endCursorPosition = maskedValue.length;
    } else if (
      startCursorPosition &&
      endCursorPosition &&
      maskedValue.length > maskedInputValue.length &&
      selectionStart &&
      maskedValue[selectionStart - 1] === " "
    ) {
      startCursorPosition += 1;
      endCursorPosition += 1;
    }

    moveCursor(target, startCursorPosition, endCursorPosition);

    setCardType(detectedCardType);
    setInputState({
      ...inputState,
      inputValue: value,
      maskedInputValue: maskedValue,
      cursorStart: startCursorPosition ?? 0,
      cursorEnd: endCursorPosition ?? 0,
      contentPasted: false,
      keyStrokeCount: keyStrokeCount + 1,
    });

    if (typeof onChange === "function") {
      onChange({
        event,
        cardNumber: value,
        cardMaskedNumber: maskedValue,
        cardType: detectedCardType,
      });
    }
  };

  const onFocusEvent = (event: FocusEvent) => {
    if (typeof onFocus === "function") {
      onFocus(event);
    }

    const maskedValue = maskCard(inputValue);
    const updatedState = { ...inputState, maskedInputValue: maskedValue };
    if (!isValid) {
      updatedState.isPotentiallyValid = true;
    }

    setInputState((newState: InputState) => ({ ...newState, ...updatedState }));
  };

  const onBlurEvent = (event: FocusEvent) => {
    const updatedState = {
      maskedInputValue,
      isPotentiallyValid,
      contentPasted: false,
    };

    if (isValid) {
      updatedState.maskedInputValue = maskValidCard(maskedInputValue);
    } else {
      updatedState.isPotentiallyValid = false;
    }

    if (typeof onBlur === "function") {
      onBlur(event);
    }

    setInputState((newState) => ({ ...newState, ...updatedState }));
  };

  const onKeyDownEvent = (event: KeyboardEvent) => {
    if (allowNavigation) {
      navigateOnKeyDown(event, navigation);
    }
  };

  const onPasteEvent = () => {
    setInputState((newState: InputState) => ({
      ...newState,
      contentPasted: true,
    }));
  };

  return (
    <input
      name={name}
      autocomplete={autocomplete}
      // inputmode="numeric"
      ref={ref}
      type={type}
      className={className}
      placeholder={placeholder}
      value={maskedInputValue}
      style={style}
      maxLength={maxLength}
      onInput={setValueAndCursor}
      onFocus={onFocusEvent}
      onBlur={onBlurEvent}
      onKeyDown={onKeyDownEvent}
      onPaste={onPasteEvent}
    />
  );
};
