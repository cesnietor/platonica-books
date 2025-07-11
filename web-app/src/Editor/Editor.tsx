import "./style.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import ToolbarPlugin from "./ToolBarPlugin";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";
import Theme from "./Theme";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode,
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error): void {
  console.error(error);
}

// TODO: test handle onchange as we wish
function MyOnChangePlugin(props: {
  onChange: (editorState: EditorState) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const { onChange } = props;
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

// Reload Editor At mount
function ResetEditorPlugin({ contentJson }: { contentJson: string }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      const state = editor.parseEditorState(contentJson);
      editor.setEditorState(state);
    });
  }, [editor, contentJson]);
  return null;
}

const editorConfig: InitialConfigType = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "MyEditor",
  nodes: [ParagraphNode, TextNode],
  onError,
  theme: Theme,
};

export interface MyEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

function Editor({ initialContent, onSave }: MyEditorProps) {
  const [content, setContent] = useState<string>(initialContent);
  const [isDirty, setDirty] = useState(false);
  const [isSaving, setSaving] = useState(false);

  // FIXME: maybe remove this
  // FIXME: if using, fix dirty state cause is being set to true always on mount
  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const stateString = editorState.toJSON();
      setContent(JSON.stringify(stateString));
      setDirty(true);
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      onSave(content);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [content, onSave, isDirty]);

  return (
    <LexicalComposer
      initialConfig={{
        editorState: initialContent,
        ...editorConfig,
      }}
    >
      <div className="editor-container">
        <ToolbarPlugin />
        {/* FIXME: make this button nicer */}
        <button onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? "Saving…" : isDirty ? "Save" : "Saved"}
        </button>
        <div className="editor-inner">
          <ResetEditorPlugin contentJson={initialContent} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={"Enter some text..."}
                placeholder={
                  <div className="editor-placeholder">Enter some text...</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <MyOnChangePlugin onChange={handleChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;
