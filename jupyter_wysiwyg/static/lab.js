/**
 * Import the required libraries
 */
const $ = require('jquery');
require('ckeditor');



/**
 * Attach a WYSIWYG mode button to a cell, if that cell if of the Markdown type and rendered.
 * Gracefully ignore any cells that are not rendered or which are of an incorrect type.
 *
 * @param cell - Jupyter cell object for WYSIWYG button
 */
function add_wysiwyg_button(cell) {
    // Get the blank left area
    const blank_area = $(cell).find(".jp-InputPrompt");
    console.log(blank_area);
    console.log("ok");

    // Create the wrapper div
    const wrapper = $("<div></div>")
        .css("position", "relative")
        .css("top", -6)
        .css("display", "block")
        .css("width", "100%")
        .css("text-align", "center");

    // Create the WYSIWYG toggle button
    const wysiwyg_button = $("<button></button>")
        .css("margin-right", 5)
        .attr("title", "Rich Text Editing")
        .addClass("btn btn-default btn-sm wysiwyg-toggle wysiwyg-status wysiwyg-off")
        .append("<i class='fa fa-file-text-o'></i>")
        .click(function(event) {
            if (is_wysiwyg_mode(cell)) {
                disable_wysiwyg_mode(cell);
                cell.unrender();
            }
            else {
                init_wysiwyg_mode(cell);
            }
            event.stopPropagation();
        })
        .show();

    const done_button = $("<button></button>")
        .attr("title", "Run Cell")
        .addClass("btn btn-default btn-sm wysiwyg-done")
        .append("<i class='fa-step-forward fa'></i>")
        .click(function(event) {
            if (is_wysiwyg_mode(cell)) {
                disable_wysiwyg_mode(cell);
                hide_wysiwyg_button(cell);
            }
            else {
                hide_wysiwyg_button(cell);
                cell.render()
            }
            event.stopPropagation();
        })
        .show();

    // Append the buttons to the UI
    wrapper.append(wysiwyg_button);
    wrapper.append(done_button);
    blank_area.append(wrapper)
}

/**
 * Attach WYSIWYG mode buttons to all existing cells in the notebook.
 * Used when loading a notebook.
 */
function attach_buttons() {
    const markdown_cells = $(".jp-NotebookPanel .jp-Cell.jp-MarkdownCell");
    $.each(markdown_cells, function(i, e) {
        add_wysiwyg_button(e);
    });
}

/**
 * Initialize the WYSIWYG functonality
 *
 * @param app - the JupyterLab app
 */
function init_wysiwyg(app) {
    console.log(app.commands);
    console.log(CKEDITOR);
    setTimeout(attach_buttons, 2000)
    //attach_buttons();
}

/**
 * Export the JupyterLab extension
 */
module.exports = [{
    id: 'jupyter_wysiwyg',
    autoStart: true,
    activate: init_wysiwyg
}];