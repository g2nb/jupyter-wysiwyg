import { NotebookPanel, StaticNotebook } from "@jupyterlab/notebook";
import { Cell, MarkdownCell, IMarkdownCellModel } from "@jupyterlab/cells";
import { IStateDB } from '@jupyterlab/statedb';
import { CodeEditor } from "@jupyterlab/codeeditor";
import { CommandRegistry } from "@lumino/commands";
import { Token, UUID } from "@lumino/coreutils";
import { IDisposable } from "@lumino/disposable";
import { Signal } from "@lumino/signaling";
import { Widget } from "@lumino/widgets";

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
        console.log('overridden markdown cell created');
        let model = options.model;
        let wysiwyg_editor = (options: CodeEditor.IOptions) => {
            return new TinyMCEEditor(options, model);
        };

        let content_factory = new EditorContentFactory({editorFactory: wysiwyg_editor} as Cell.ContentFactory.IOptions);
        options.contentFactory = content_factory;

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

export class TinyMCEEditor implements CodeEditor.IEditor {
    constructor(options: TinyMCEEditor.IOptions, markdownModel: IMarkdownCellModel) {
        console.log("WYSIWYG Editor Created!");
        this.host = options.host;
        this.host.classList.add("jp-RenderedHTMLCommon");
        this.host.classList.add('jp-TinyMCE');
        this.host.addEventListener('focus', this.blur, true);
        this.host.addEventListener('blur', this.focus, true);
        this.host.addEventListener('scroll', this.scroll, true);

        this._uuid = options.uuid || UUID.uuid4();

        this._model = options.model;
        this.is_markdown = (markdownModel.metadata.get("markdownMode") as boolean);
        if (!!this.is_markdown) this.is_markdown = false;
        this._view = TinyMCEEditor.create_editor(this.host, this.model);
    }

    static DEFAULT_NUMBER: number = 0;

    private _model: CodeEditor.IModel;
    private _uuid = '';
    private _is_disposed = false;
    // private _keydownHandlers = new Array<CodeEditor.KeydownHandler>();
    private _selection_style: CodeEditor.ISelectionStyle;
    private _view: TinyMCEView;
    public is_markdown = false;

    readonly charWidth: number;
    readonly edgeRequested = new Signal<this, CodeEditor.EdgeLocation>(this);
    readonly host: HTMLElement;
    readonly isDisposed: boolean;
    readonly lineHeight: number;

    get view() { return this._view; }
    get uuid() { return this._uuid; }
    get is_disposed() { return this._is_disposed; }
    get model() { return this._model; }
    get lineCount() { return TinyMCEEditor.DEFAULT_NUMBER; }
    get selectionStyle() { return this._selection_style; }

    set uuid(value) { this._uuid = value; }
    set selectionStyle(value) { this._selection_style = value; }

    addKeydownHandler(handler: (instance: CodeEditor.IEditor, event: KeyboardEvent) => boolean): IDisposable {
        return undefined;
    }

    blur(): void {
        console.log("blurred");
        this._view.blur();
    }

    clearHistory(): void {
    }

    dispose(): void {
        if (this._is_disposed) return;
        this._is_disposed = true;
        this.host.removeEventListener('focus', this.focus, true);
        this.host.removeEventListener('focus', this.blur, true);
        this.host.removeEventListener('focus', this.scroll, true);
        Signal.clearData(this);
    }

    focus(): void {
        console.log("focused");
        this._view.focus();
    }

    scroll(): void {
    }

    getCoordinateForPosition(position: CodeEditor.IPosition): CodeEditor.ICoordinate {
        return undefined;
    }

    getCursorPosition(): CodeEditor.IPosition {
        return undefined;
    }

    getLine(line: number): string | undefined {
        return undefined;
    }

    getOffsetAt(position: CodeEditor.IPosition): number {
        return 0;
    }

    getOption<K extends keyof CodeEditor.IConfig>(option: K): CodeEditor.IConfig[K] {
        return undefined;
    }

    getPositionAt(offset: number): CodeEditor.IPosition | undefined {
        return undefined;
    }

    getPositionForCoordinate(coordinate: CodeEditor.ICoordinate): CodeEditor.IPosition | null {
        return undefined;
    }

    getSelection(): CodeEditor.IRange {
        return undefined;
    }

    getSelections(): CodeEditor.IRange[] {
        return [];
    }

    getTokenForPosition(position: CodeEditor.IPosition): CodeEditor.IToken {
        return undefined;
    }

    getTokens(): CodeEditor.IToken[] {
        return [];
    }

    hasFocus(): boolean {
        return false;
    }

    newIndentedLine(): void {
    }

    redo(): void {
    }

    refresh(): void {
    }

    resizeToFit(): void {
    }

    revealPosition(position: CodeEditor.IPosition): void {
    }

    revealSelection(selection: CodeEditor.IRange): void {
    }

    setCursorPosition(position: CodeEditor.IPosition): void {
    }

    setOption<K extends keyof CodeEditor.IConfig>(option: K, value: CodeEditor.IConfig[K]): void {
    }

    setOptions<K extends keyof CodeEditor.IConfig>(options: CodeEditor.IConfigOptions<K>[]): void {
    }

    setSelection(selection: CodeEditor.IRange): void {
    }

    setSelections(selections: CodeEditor.IRange[]): void {
    }

    setSize(size: CodeEditor.IDimension | null): void {
    }

    undo(): void {}

    static create_editor(host: HTMLElement, model: CodeEditor.IModel):TinyMCEView {
        // TODO: Implement
        return new TinyMCEView();
    }
}

export namespace TinyMCEEditor {
    export interface IOptions extends CodeEditor.IOptions {
        config?: Partial<IConfig>;
    }
    export interface IConfig extends CodeEditor.IConfig {}
}

export class TinyMCEView {
    // TODO: Implement

    blur() {}
    focus() {}
}