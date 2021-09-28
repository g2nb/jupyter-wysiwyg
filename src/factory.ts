import { NotebookPanel, StaticNotebook } from "@jupyterlab/notebook";
import { Cell, MarkdownCell } from "@jupyterlab/cells";
import { IStateDB } from '@jupyterlab/statedb';
import { CodeEditor } from "@jupyterlab/codeeditor";
import { CommandRegistry } from "@lumino/commands";
import { Token } from "@lumino/coreutils";
import { Widget } from "@lumino/widgets";
import { TinyMCEEditor } from "./editor";

export class EditorContentFactory extends NotebookPanel.ContentFactory implements IEditorContentFactory {
    constructor(options?: Cell.ContentFactory.IOptions | undefined) {
        super(options);
    }

    /**
     * Create a markdown cell with the WYSIWYG editor rather than CodeMirror
     *
     * @param options
     * @param parent
     */
    createMarkdownCell(options: MarkdownCell.IOptions, parent: StaticNotebook): MarkdownCell {
        const model = options.model;
        options.contentFactory = new EditorContentFactory({
            editorFactory: (options: CodeEditor.IOptions) => {
                return new TinyMCEEditor(options, model);
            }
        } as Cell.ContentFactory.IOptions);

        return new MarkdownCell(options).initializeState();
      }
}

export const IEditorContentFactory = new Token<IEditorContentFactory>("jupyter-wysiwyg");

export interface IEditorContentFactory extends NotebookPanel.IContentFactory {}

export class EditorWidget extends Widget {
    constructor(commands: CommandRegistry) {
        super();
    }

    render_menu(activeCell: Cell, state: IStateDB, commands: CommandRegistry) {
        console.log("render_menu() called");
        // TODO: Implement
    }

    render_inactive_menu(state: IStateDB) {
        console.log("render_inactive_menu() called");
        // TODO: Implement
    }
}