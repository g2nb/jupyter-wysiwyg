import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { MarkdownCell } from '@jupyterlab/cells';
import { IStateDB } from '@jupyterlab/statedb';
import { EditorContentFactory, IEditorContentFactory, EditorWidget } from './factory';
import "../style/index.css";

/**
 * The jupyter-wysiwyg plugins
 */
const wysiwyg_plugin: JupyterFrontEndPlugin<void> = {
    id: "@g2nb/jupyter-wysiwyg:plugin",
    requires: [INotebookTracker, IStateDB],
    activate: activate_editor,
    autoStart: true
};

const add_wysiwyg: JupyterFrontEndPlugin<IEditorContentFactory> = {
    id: "@g2nb/jupyter-wysiwyg:add-wysiwyg",
    provides: NotebookPanel.IContentFactory,
    activate: override_editor,
    autoStart: true
};

function activate_editor(app: JupyterFrontEnd, tracker: INotebookTracker, state: IStateDB) {
    console.log('jupyter-wysiwyg plugin activated!');
    EditorWidget.instance().tracker = tracker;

    // When the current notebook is changed
    tracker.currentChanged.connect(() => {
        if (!tracker.currentWidget) return; // If no current notebook, do nothing

        // When the cell is changed
        tracker.activeCellChanged.connect(() => {
            const active_cell = tracker.activeCell;
            if (active_cell instanceof MarkdownCell && !active_cell.rendered && EditorWidget.instance().no_side_button()) {
                active_cell.editor.focus();
                EditorWidget.instance().render_side_button();
                EditorWidget.instance().remove_side_button();
            }
            else {
                EditorWidget.instance().remove_side_button();
            }
        });
    });
}

function override_editor(app: JupyterFrontEnd):EditorContentFactory {
    console.log('jupyter-wysiwyg override activated!');
    return new EditorContentFactory();
}

export default [wysiwyg_plugin, add_wysiwyg];