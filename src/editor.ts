import { NotebookPanel } from "@jupyterlab/notebook";
import { Cell } from "@jupyterlab/cells";
import { Token } from "@lumino/coreutils";

export class EditorContentFactory extends NotebookPanel.ContentFactory implements IEditorContentFactory {
    constructor(options?: Cell.ContentFactory.IOptions | undefined) {
        super(options);
    }
}

export const IEditorContentFactory = new Token<IEditorContentFactory>("jupyter-wysiwyg");

export interface IEditorContentFactory extends NotebookPanel.IContentFactory {}
