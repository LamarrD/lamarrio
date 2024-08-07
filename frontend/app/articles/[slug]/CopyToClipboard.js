"use client";

function copyText(entryText) {
  navigator.clipboard.writeText(entryText);
}

export default function CopyToClipboard(props) {
  return (
    <button
      className="absolute top-0 right-0 mt-1 mr-.5 hover:text-white py-1 px-2 rounded text-slate-500"
      onClick={() => copyText(props.text)}>
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />{" "}
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  );
}
