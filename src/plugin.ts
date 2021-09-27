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
    id: "@genepattern/jupyter-wysiwyg:plugin",
    requires: [INotebookTracker, IStateDB],
    activate: activate_editor,
    autoStart: true
};

const add_wysiwyg: JupyterFrontEndPlugin<IEditorContentFactory> = {
    id: "@genepattern/jupyter-wysiwyg:add-wysiwyg",
    provides: NotebookPanel.IContentFactory,
    activate: override_editor,
    autoStart: true
};

function activate_editor(app: JupyterFrontEnd, tracker: INotebookTracker, state: IStateDB) {
    console.log('WYSIWYG Activated!');
    let editor_widget = new EditorWidget(app.commands);

    // When the current notebook is changed
    tracker.currentChanged.connect(() => {
        if (!tracker.currentWidget) return; // If no current notebook, do nothing
        tracker.currentWidget.toolbar.insertAfter("cellType", "wysiwyg-menu", editor_widget);

        // When the cell is changed
        tracker.activeCellChanged.connect(() => {
            let active_cell = tracker.activeCell;
            if (active_cell instanceof MarkdownCell) {
                active_cell.editor.focus();
                editor_widget.render_menu(active_cell, state, app.commands);
            }
            else {
                editor_widget.render_inactive_menu(state);
            }
        });
    });
}

function override_editor(app: JupyterFrontEnd):EditorContentFactory {
    console.log('WYSIWYG Override Activated!');
    return new EditorContentFactory();
}

export default [wysiwyg_plugin, add_wysiwyg];