import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
}

type InputProps = BaseProps & { multiline?: false } & InputHTMLAttributes<HTMLInputElement>;
type AreaProps = BaseProps & { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Ô nhập kính mờ với nhãn nổi (label bay lên khi focus / có chữ) và lỗi rung nhẹ. */
export function FloatingField(props: InputProps | AreaProps) {
  const { label, error, hint, id, multiline, ...rest } = props;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const common = {
    id,
    placeholder: " ",
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    className: "field-input",
  };

  return (
    <div>
      <div className="field" data-invalid={Boolean(error)}>
        {multiline ? (
          <textarea {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...common} />
        ) : (
          <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} {...common} />
        )}
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 animate-pop pl-2 text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 pl-2 text-xs text-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

