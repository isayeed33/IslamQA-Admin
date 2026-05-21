import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  error?: boolean;
}

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const FORMATS = [
  "header",
  "bold", "italic", "underline",
  "list", "bullet",
  "blockquote", "link",
];

/** Quill emits this string when the editor is visually empty */
const QUILL_EMPTY = "<p><br></p>";

/**
 * Controlled Quill rich-text editor.
 * Use with react-hook-form via <Controller>.
 * Passes "" to onChange when the editor is empty so yup required() works.
 */
const QuillEditor = ({ value, onChange, placeholder, dir, error }: QuillEditorProps) => {
  const handleChange = (val: string) => {
    onChange(val === QUILL_EMPTY ? "" : val);
  };

  return (
    <div dir={dir} className={`quill-editor-wrapper${error ? " quill-has-error" : ""}`}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        modules={MODULES}
        formats={FORMATS}
      />
    </div>
  );
};

export default QuillEditor;
