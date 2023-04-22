import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useFocused, useSlate } from "slate-react";
import { Editor, Range } from "slate";
import { useRhymes } from "../hooks/useRhymes";

export const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

// TODO: see if we can drop the element from the DOM when not being used?
export const HoveringToolbar = () => {
  const [lastSelection, setLastSelection] = useState("");
  const { rhymes, getRhymes } = useRhymes();
  const ref = useRef();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;
    const domSelection = window.getSelection().toString();

    if (!el) return;
    if (lastSelection === domSelection) return;
    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.classList.replace("opacity-100", "opacity-0");
      return;
    }

    setLastSelection(domSelection);
    getRhymes(domSelection);
    el.classList.replace("opacity-0", "opacity-100");
  });

  return (
    <Portal>
      <div
        ref={ref}
        className="bg-white dark:bg-dark max-w-sm p-2 fixed top-10
                   left-10 z-40 opacity-0 transition-opacity rounded
                   border -mt-2"
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <h3>Rhymes:</h3>
        {rhymes.map((e, i) => (
          <p key={i}>{e.word}</p>
        ))}
      </div>
    </Portal>
  );
};
