import "./style.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
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
import { Button, FormControlLabel, Switch } from "@mui/material";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
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

// FIXME: handle errors properly
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error): void {
  console.error(error);
}

// Reload Editor at mount, this loads initial content
function ResetEditorPlugin({ contentJson }: { contentJson?: string | null }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (contentJson) {
      editor.update(() => {
        const state = editor.parseEditorState(contentJson);
        editor.setEditorState(state);
      });
    }
  }, [editor, contentJson]);
  return null;
}

function EditablePlugin({ editable }: { editable: boolean }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);
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
  initialContent?: string | null;
  onSave: (content: string) => void;
}

// Check Lexical Basic struct
function isValidState(raw: string | undefined | null): boolean {
  try {
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.root?.children);
  } catch {
    return false;
  }
}

function Editor({ initialContent, onSave }: MyEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<string | null | undefined>(
    initialContent
  );
  const [isSaving, setIsSaving] = useState(false);

  // called by OnChangePlugin only when is in edit mode
  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (!isEditing) return;
      editorState.read(() => {
        const newState = JSON.stringify(editorState.toJSON());
        setContent(newState);
      });
    },
    [isEditing]
  );

  const handleSave = useCallback(async () => {
    if (!isEditing || content == null) return;
    setIsSaving(true);
    try {
      onSave(content);
    } finally {
      setIsSaving(false);
    }
  }, [isEditing, content, onSave]);

  // memoize the initializer so Lexical only calls it once per mount
  const getInitialState = useCallback(
    () => (isValidState(content) ? content : null),
    [content]
  );

  return (
    <LexicalComposer
      initialConfig={{
        editorState: getInitialState(),
        ...editorConfig,
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={isEditing}
            onChange={() => setIsEditing((prev) => !prev)}
            color="primary"
          />
        }
        label={isEditing ? "Disable Edit" : "Edit"}
      />

      <Button
        onMouseDown={(e) => e.preventDefault()}
        variant="outlined"
        onClick={handleSave}
        disabled={!isEditing || isSaving}
      >
        {isSaving ? "Saving…" : "Save"}
      </Button>
      <div className="editor-container">
        {/* TODO: Disable toolbar depending on Edit mode */}
        <ToolbarPlugin />
        <div className="editor-inner">
          <EditablePlugin editable={isEditing} />
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
          <OnChangePlugin onChange={handleChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;
