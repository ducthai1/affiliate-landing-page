"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "./contact.action";
import { CONTACT_EMPTY_VALUES, CONTACT_FIELD_NAMES, CONTACT_INITIAL_STATE } from "./contact.const";
import type { ContactFieldErrors, ContactFormState, ContactFormValues } from "./contact.type";

type TextField = Exclude<keyof ContactFormValues, "channels">;

/** Trạng thái form liên hệ: giá trị (controlled), lỗi từng ô, màn cảm ơn. */
export function useContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, CONTACT_INITIAL_STATE);
  const [values, setValues] = useState<ContactFormValues>(CONTACT_EMPTY_VALUES);
  // Ô nào người dùng đã sửa sau lần gửi gần nhất → ẩn lỗi cũ của ô đó.
  const [edited, setEdited] = useState<{ for: ContactFormState; keys: Set<string> }>({ for: state, keys: new Set() });
  const [dismissed, setDismissed] = useState<ContactFormState | null>(null);
  const startedAtRef = useRef(0);

  // Mốc thời gian mở form (chống bot gửi tức thì). Gắn vào FormData lúc gửi — không để trong
  // ô ẩn vì React tự reset form sau mỗi lần action, ô ẩn sẽ mất giá trị ở lần gửi thứ hai.
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, [dismissed]);

  const submit = (fd: FormData) => {
    fd.set(CONTACT_FIELD_NAMES.startedAt, String(startedAtRef.current));
    formAction(fd);
  };

  const editedKeys = edited.for === state ? edited.keys : new Set<string>();
  const serverErrors: ContactFieldErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const errors = Object.fromEntries(
    Object.entries(serverErrors).filter(([k]) => !editedKeys.has(k) && !(k === "contact" && (editedKeys.has("phone") || editedKeys.has("email")))),
  ) as ContactFieldErrors;

  const markEdited = (key: string) => {
    if (editedKeys.has(key)) return;
    setEdited({ for: state, keys: new Set(editedKeys).add(key) });
  };

  const setField = (key: TextField, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    markEdited(key);
  };

  const toggleChannel = (key: string) => {
    setValues((v) => ({
      ...v,
      channels: v.channels.includes(key) ? v.channels.filter((k) => k !== key) : [...v.channels, key],
    }));
  };

  const showSuccess = state.status === "success" && state !== dismissed;

  const reset = () => {
    setDismissed(state);
    setValues(CONTACT_EMPTY_VALUES);
  };

  return {
    state,
    submit,
    pending,
    values,
    errors,
    formMessage: state.status === "error" ? state.message : "",
    showSuccess,
    successName: state.status === "success" ? state.name : "",
    setField,
    toggleChannel,
    reset,
  };
}
