import { NotebookActions, NotebookPanel, StaticNotebook } from "@jupyterlab/notebook";
import { Cell, MarkdownCell } from "@jupyterlab/cells";
import { CodeEditor } from "@jupyterlab/codeeditor";
import { CommandRegistry } from "@lumino/commands";
import { Token } from "@lumino/coreutils";
import { Widget } from "@lumino/widgets";
import { TinyMCEEditor } from "./editor";
import { runIcon } from "@jupyterlab/ui-components";

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

    render_side_button(active_cell: Cell, active_notebook: NotebookPanel) {
        const sidebar = this.sidebar(active_cell.node);
        const run_button = this.run_button(active_cell, active_notebook);
        sidebar.append(run_button);
    }

    remove_side_button(previous_cell: Cell) {
        if (!previous_cell) return; // If there is no previous cell, do nothing
        const sidebar = this.sidebar(previous_cell.node);
        sidebar.querySelector(".jp-RenderButton")?.remove();
    }

    sidebar(node: HTMLElement) {
        return node.closest('.jp-Cell')?.querySelector('.jp-InputArea-prompt');
    }

    run_button(cell: Cell, panel: NotebookPanel) {
        const button = document.createElement("button");
        button.classList.add("jp-ToolbarButtonComponent", "jp-Button", "jp-RenderButton");
        button.setAttribute("title", "Render this cell");
        button.innerHTML = runIcon.svgstr;
        button.addEventListener("click", () => {
            panel.content.select(cell);
            setTimeout(() => void NotebookActions.runAndAdvance(panel.content, panel.sessionContext), 200);
        });
        return button;
    }
}