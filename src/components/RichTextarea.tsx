import { forwardRef, useRef, useCallback } from "react";

interface RichTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

/** Minimal markdown-style toolbar for text areas. Works with React Hook Form register(). */
const RichTextarea = forwardRef<HTMLTextAreaElement, RichTextareaProps>(
  ({ className = "", style, ...rest }, forwardedRef) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge forwarded ref + inner ref
    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [forwardedRef],
    );

    /** Update textarea value and fire a native "input" event so RHF picks up the change */
    const applyChange = (newValue: string, cursorPos: number) => {
      const el = innerRef.current;
      if (!el) return;
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
      setter?.call(el, newValue);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      requestAnimationFrame(() => {
        el.selectionStart = cursorPos;
        el.selectionEnd   = cursorPos;
        el.focus();
      });
    };

    const wrapInline = (marker: string) => {
      const el = innerRef.current;
      if (!el) return;
      const { selectionStart: s, selectionEnd: e, value } = el;
      const selected = value.slice(s, e);
      const insert   = marker + (selected || "text") + marker;
      applyChange(value.slice(0, s) + insert + value.slice(e), s + marker.length + (selected || "text").length + marker.length);
    };

    const prefixLines = (prefix: string) => {
      const el = innerRef.current;
      if (!el) return;
      const { selectionStart: s, selectionEnd: e, value } = el;
      const block   = value.slice(s, e) || "";
      const prefixed = block ? block.split("\n").map(l => prefix + l).join("\n") : prefix;
      const insert   = prefixed;
      applyChange(value.slice(0, s) + insert + value.slice(e), s + insert.length);
    };

    const insertAtCursor = (text: string) => {
      const el = innerRef.current;
      if (!el) return;
      const { selectionStart: s, value } = el;
      const insert = text;
      applyChange(value.slice(0, s) + insert + value.slice(s), s + insert.length);
    };

    const tools: { label: string; title: string; italic?: boolean; mono?: boolean; action: () => void }[] = [
      { label: "B",  title: "Bold",          action: () => wrapInline("**") },
      { label: "I",  title: "Italic",  italic: true, action: () => wrapInline("*") },
      { label: "H2", title: "Heading",  mono: true, action: () => prefixLines("## ") },
      { label: "H3", title: "Subheading", mono: true, action: () => prefixLines("### ") },
      { label: "❝",  title: "Block quote",   action: () => prefixLines("> ") },
      { label: "•",  title: "Bullet list",   action: () => prefixLines("- ") },
      { label: "1.", title: "Numbered list", mono: true, action: () => prefixLines("1. ") },
      { label: "—",  title: "Divider",       action: () => insertAtCursor("\n\n---\n\n") },
    ];

    return (
      <div className="rich-textarea-wrapper">
        {/* Toolbar */}
        <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-600 rounded-t-lg">
          {tools.map((t, i) => (
            <button
              key={i}
              type="button"
              title={t.title}
              onMouseDown={(e) => { e.preventDefault(); t.action(); }}
              className={[
                "min-w-[26px] h-6 px-1.5 text-xs rounded transition-colors",
                "text-gray-600 dark:text-gray-300",
                "hover:bg-gray-200 dark:hover:bg-gray-600",
                t.italic ? "italic" : "",
                t.mono   ? "font-mono font-bold" : "font-bold",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={setRef}
          className={`rounded-t-none border-t-0 ${className}`}
          style={style}
          {...rest}
        />
      </div>
    );
  },
);

RichTextarea.displayName = "RichTextarea";
export default RichTextarea;
