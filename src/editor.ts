import { CodeEditor } from "@jupyterlab/codeeditor";
import { IMarkdownCellModel } from "@jupyterlab/cells";
import { UUID } from "@lumino/coreutils";
import { Signal } from "@lumino/signaling";
import { IDisposable } from "@lumino/disposable";

 /* Import TinyMCE */
import TinyMCE from "tinymce";
import {JSONValue} from "@lumino/coreutils/src/json";

/* Default icons are required for TinyMCE 5.3 or above */
import 'tinymce/icons/default';

/* A theme is also required */
import 'tinymce/themes/silver';

/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css';

/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';

/* Import content css */
// import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
// import contentCss from 'tinymce/skins/content/default/content.css';

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
        // This is a dummy implementation that prevents an error in the console
        return new class implements CodeEditor.IPosition {
            [key: string]: JSONValue;
            line: 0;
            column: 0;
        }();
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
        return new TinyMCEView(host, model);
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
    constructor(host: HTMLElement, model: CodeEditor.IModel) {
        // Create the wrapper
        const wrapper = document.createElement("div");
        wrapper.innerHTML = model.value.text;
        host.appendChild(wrapper);

        // Wait for cell initialization before initializing editor
        setTimeout(() => {
            TinyMCE.init({
                target: wrapper,
                skin: false,
                content_css : false,
                // content_style: contentUiCss.toString() + '\n' + contentCss.toString(),
                branding: false,
                contextmenu: false,
                elementpath: false,
                menubar: false,
                height: 500,
                resize: false,
                toolbar: 'styleselect fontsizeselect | bold italic underline strikethrough | subscript superscript | forecolor backcolor emoticons | bullist numlist outdent indent blockquote',
                init_instance_callback: function (editor: any) {
                    editor.on('Change', function (e: any) {
                        console.log('Editor contents was changed.');
                        model.value.text = editor.getContent();
                    });
                }
            }).then(editor => {
                // xxx
            });
        }, 500);
    }

    blur() {}
    focus() {}
}