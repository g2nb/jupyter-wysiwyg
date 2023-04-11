import {INotebookTracker, NotebookActions, NotebookPanel, StaticNotebook} from "@jupyterlab/notebook";
import { Cell, MarkdownCell } from "@jupyterlab/cells";
import { CodeEditor } from "@jupyterlab/codeeditor";
import { Token } from "@lumino/coreutils";
import { Widget } from "@lumino/widgets";
import { TinyMCEEditor } from "./editor";
import { fileIcon, runIcon } from "@jupyterlab/ui-components";

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
        const defaultEditorFactory = options.contentFactory.editorFactory;
        options.contentFactory = new EditorContentFactory({
            editorFactory: (options: CodeEditor.IOptions) => {
                return new TinyMCEEditor(options, model, defaultEditorFactory(options as any));
            }
        } as any);

        return new MarkdownCell(options).initializeState();
      }
}

export const IEditorContentFactory = new Token<IEditorContentFactory>("jupyter-wysiwyg");

export interface IEditorContentFactory extends NotebookPanel.IContentFactory {}

export class EditorWidget extends Widget {
    constructor() {
        super();
    }

    static _singleton: EditorWidget;
    private _tracker: INotebookTracker;
    private _previous_cell: Cell;

    static instance() {
        // Instantiate if necessary
        if (!EditorWidget._singleton) EditorWidget._singleton = new EditorWidget();
        return EditorWidget._singleton;
    }

    get tracker(): INotebookTracker {
        return this._tracker;
    }

    set tracker(tracker: INotebookTracker) {
        this._tracker = tracker;
    }

    get previous_cell(): Cell {
        return this._previous_cell;
    }

    set previous_cell(_previous_cell: Cell) {
        this._previous_cell = _previous_cell;
    }

    no_side_button(): boolean {
        return !this.sidebar(this._tracker.activeCell.node)?.querySelector('.jp-RenderButton');
    }

    render_side_button() {
        const sidebar = this.sidebar(this._tracker.activeCell.node);
        const run_button = this.run_button(this._tracker.activeCell, this._tracker.currentWidget);
        const wysiwyg_button = this.wysiwyg_button(this._tracker.activeCell, this._tracker.currentWidget);
        sidebar.append(run_button);
        sidebar.append(wysiwyg_button);
    }

    remove_side_button() {
        if (this._previous_cell) {
            const sidebar = this.sidebar(this._previous_cell.node);
            sidebar.querySelectorAll(".jp-RenderButton").forEach(e => {
                e.remove();
            });
        }
        this._previous_cell = this._tracker.activeCell;
    }

    sidebar(node: HTMLElement) {
        return node.closest('.jp-Cell')?.querySelector('.jp-InputArea-prompt');
    }

    run_button(cell: Cell, panel: NotebookPanel) {
        const button = document.createElement("button");
        button.classList.add("jp-ToolbarButtonComponent", "jp-Button", "jp-RenderButton", "jp-side-button");
        button.setAttribute("title", "Render this cell");
        button.innerHTML = runIcon.svgstr;
        button.addEventListener("click", () => {
            panel.content.select(cell);
            setTimeout(() => void NotebookActions.runAndAdvance(panel.content, panel.sessionContext), 200);
        });
        return button;
    }

    wysiwyg_button(cell: Cell, panel: NotebookPanel) {
        const button = document.createElement("button");
        button.classList.add("jp-ToolbarButtonComponent", "jp-Button", "jp-RenderButton", "jp-side-button");
        button.setAttribute("title", "Toggle the Rich Text Editor");
        button.innerHTML = fileIcon.svgstr;
        button.addEventListener("click", () => {
            const tiny_mce = cell.node.querySelector('.tox-tinymce') as HTMLElement;
            const code_mirror = cell.node.querySelector('.CodeMirror') as HTMLElement;
            if (code_mirror.style.display === 'none') {
                code_mirror.style.display = 'block';
                tiny_mce.style.display = 'none';
            }
            else {
                code_mirror.style.display = 'none';
                tiny_mce.style.display = 'flex';
            }
        });
        return button;
    }
}