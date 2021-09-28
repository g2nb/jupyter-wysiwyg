import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { Cell, MarkdownCell } from '@jupyterlab/cells';
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
    console.log('jupyter-wysiwyg plugin activated!');
    let editor_widget = new EditorWidget(app.commands);
    let previous_cell: Cell | null = null;

    // When the current notebook is changed
    tracker.currentChanged.connect(() => {
        if (!tracker.currentWidget) return; // If no current notebook, do nothing

        // When the cell is changed
        tracker.activeCellChanged.connect(() => {
            const active_cell = tracker.activeCell;
            const active_notebook = tracker.currentWidget;
            if (active_cell instanceof MarkdownCell && !active_cell.rendered) {
                active_cell.editor.focus();
                editor_widget.render_side_button(active_cell, active_notebook);
                editor_widget.remove_side_button(previous_cell);
                previous_cell = active_cell;
            }
            else {
                editor_widget.remove_side_button(previous_cell);
                previous_cell = active_cell;
            }
        });
    });
}

function override_editor(app: JupyterFrontEnd):EditorContentFactory {
    console.log('jupyter-wysiwyg override activated!');
    return new EditorContentFactory();
}

export default [wysiwyg_plugin, add_wysiwyg];