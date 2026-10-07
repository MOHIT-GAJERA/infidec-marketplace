import { useId } from "react";

type Props = {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => React.ReactNode;
  className?: string;
};

/** Label + control + inline error/hint, wired up for screen readers. */
export function Field({ label, error, required, hint, children, className = "" }: Props) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[15px] text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="text-sale">
            {" "}
            *
          </span>
        )}
      </label>
      <div className="mt-1.5">
        {children({ id, ...(error ? { "aria-invalid": true as const } : {}), ...(error || hint ? { "aria-describedby": msgId } : {}) })}
      </div>
      {error ? (
        <p id={msgId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={msgId} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Only allow same-site relative redirects (prevents open-redirects via ?next=). */
export function safeNext(raw: string | null, fallback = "/account") {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

export const fieldClass = (error?: string) =>
  `field ${error ? "border-red-600 focus:border-red-600 focus:ring-red-100" : ""}`;
