import type { CONTACT_TOPICS } from "./contact.const";

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export interface ContactSubmission {
  name: string;
  phone: string;
  email: string;
  company: string;
  topic: ContactTopic;
  channels: string[];
  message: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactSubmission | "contact", string>>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "success"; name: string }
  | { status: "error"; message: string; fieldErrors?: ContactFieldErrors };

/** Giá trị form phía client (giữ lại khi server báo lỗi — React tự reset form sau action). */
export interface ContactFormValues {
  name: string;
  phone: string;
  email: string;
  company: string;
  topic: string;
  channels: string[];
  message: string;
}
