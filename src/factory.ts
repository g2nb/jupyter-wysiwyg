import {INotebookTracker, NotebookActions, NotebookPanel, StaticNotebook} from "@jupyterlab/notebook";
import { Cell, MarkdownCell } from "@jupyterlab/cells";
import { CodeEditor } from "@jupyterlab/codeeditor";
import { Token } from "@lumino/coreutils";
import { Widget } from "@lumino/widgets";
import { TinyMCEEditor } from "./editor";
import { fileIcon, runIcon } from "@jupyterlab/ui-components";

export class EditorContentFactory extends NotebookPanel.ContentFactory implements IEditorContentFactory {
    constructor(options?: Cell.ContentFactory.IOptions) {
        super(options);
    }

    /**
     * Create a markdown cell with the WYSIWYG editor rather than CodeMirror
     *
     * @param options
     */
    createMarkdownCell(options: MarkdownCell.IOptions): MarkdownCell {
        const model = options.model;
        const defaultEditorFactory = options.contentFactory.editorFactory;
        options.contentFactory = new EditorContentFactory({
            editorFactory: (options: CodeEditor.IOptions) => {
                const code_mirror_host = this._code_mirror_host(options.host);
                return new TinyMCEEditor(options, model, defaultEditorFactory({host: code_mirror_host, ...options} as any));
            }
        } as any);

        return new MarkdownCell(options).initializeState();
    }

    _code_mirror_host(parent:HTMLElement): HTMLElement {
        const code_mirror_host = document.createElement("div");
        parent.appendChild(code_mirror_host);
        return code_mirror_host;
    }
}

export const IEditorContentFactory = new Token<IEditorContentFactory>(
    '@g2nb/jupyter-wysiwyg:IEditorContentFactory',
    `A factory object that creates new notebooks with the rich text editor.`
);

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
        if (this.no_side_button()) {
            const sidebar = this.sidebar(this._tracker.activeCell.node);
            const run_button = this.run_button(this._tracker.activeCell, this._tracker.currentWidget);
            const wysiwyg_button = this.wysiwyg_button(this._tracker.activeCell, this._tracker.currentWidget);
            sidebar.append(run_button);
            sidebar.append(wysiwyg_button);
        }
    }

    remove_side_button() {
        if (this._previous_cell) {
            const sidebar = this.sidebar(this._previous_cell.node);
            if (sidebar) sidebar.querySelectorAll(".jp-RenderButton").forEach(e => {
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
            (cell.editor as any).syncFromCodeMirror();
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
            (cell.editor as any).syncFromCodeMirror();

            const tiny_mce = cell.node.querySelector('.tox-tinymce') as HTMLElement;
            const code_mirror = cell.node.querySelector('.cm-editor') as HTMLElement;
            if (code_mirror.classList.contains('jw-Hidden')) {
                code_mirror.classList.remove('jw-Hidden')
                tiny_mce.classList.add('jw-Hidden');
                (cell.editor as any).refresh();
            }
            else {
                code_mirror.classList.add('jw-Hidden');
                tiny_mce.classList.remove('jw-Hidden');
                (cell.editor as any).refresh();
            }
        });
        return button;
    }
}