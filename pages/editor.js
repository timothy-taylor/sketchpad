import { useEffect, useMemo, useState } from "react";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor } from "slate";
import { supabase } from "../api/supabaseClient";
import { debounce } from "../utils/debounce";
import { HoveringToolbar } from "../components/HoveringToolBar";

const defaults = [
  { type: "paragraph", children: [{ text: "A line of text in a paragraph" }] },
];

export default function Editor() {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [initialValue, setInitialValue] = useState(defaults);
  const [loading, setLoading] = useState(true);

  const loadSketch = async () => {
    const { data: sketch } = await supabase
      .from("sketches")
      .select("content")
      .eq("id", 1)
      .limit(1)
      .single();

    if (sketch) {
      setInitialValue(sketch.content);
    }
  };

  const saveSketch = useMemo(() => {
    return debounce(async (value) => {
      await supabase.from("sketches").upsert([
        {
          id: 1,
          content: value,
        },
      ]);
    }, 5000);
  }, []);

  useEffect(() => {
    loadSketch()
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && (
        <Slate
          editor={editor}
          value={initialValue}
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => "set_selection" !== op.type
            );

            if (isAstChange) saveSketch(value);
          }}
        >
          <HoveringToolbar />
          <Editable />
        </Slate>
      )}
    </>
  );
}
