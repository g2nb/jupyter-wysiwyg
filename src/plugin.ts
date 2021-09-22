import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import EditorContentFactory from './editor';
import "../style/index.css";

/**
 * The jupyter-wysiwyg plugins
 */
const wysiwyg_plugin: JupyterFrontEndPlugin<NotebookPanel.IContentFactory> = {
    id: "@genepattern/jupyter-wysiwyg:plugin",
    // provides: NotebookPanel.IContentFactory,
    requires: [INotebookTracker],
    optional: [],
    activate: activate_plugin,
    autoStart: true
};

function activate_plugin(app: JupyterFrontEnd):EditorContentFactory {
    console.log('WYSIWYG Activated!');
    return new EditorContentFactory();
}

export default [wysiwyg_plugin];