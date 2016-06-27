// Add file path shim for Jupyter 3/4
var WYSIWYG_PATH = location.origin + Jupyter.contents.base_url + "nbextensions/jupyter_wysiwyg/";

define([
    "base/js/namespace",
    "jquery",
    WYSIWYG_PATH + "ckeditor/ckeditor.js",
    WYSIWYG_PATH + "ckeditor/adapters/jquery.js"], function(Jupyter) {

    /**
     * Take a Markdown cell and initialize WYSIWYG mode for the cell
     *
     * @param cell - Jupyter cell object for WYSIWYG mode
     */
    function init_wysiwyg_mode(cell) {
        // Check for error states
        if (cell.cell_type !== "markdown") console.log("ERROR: init_wysiwyg_mode() called on non-text cell: " + cell.cell_type);
        if (!cell.rendered) cell.render();

        // Get the DOM elements
        var textbox = cell.element.find(".text_cell_render");

        // Special case to remove anchor links before editing
        textbox.find(".anchor-link").remove();

        // Special case for placeholder text in empty cells
        if (cell.get_text().length === 0) textbox.empty();

        // Initialize CKEditor
        var editor = CKEDITOR.replace(textbox[0], {
            height: 250,
            extraPlugins: 'divarea',
            removePlugins: "magicline",
            toolbarGroups: [
                { name: 'styles', groups: [ 'styles' ] },
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
                { name: 'links', groups: [ 'links' ] },
                { name: 'insert', groups: [ 'insert' ] }
            ]
        });

        // Editor settings
        editor.on('instanceReady', function( ev ) {
            editor.setReadOnly(false);
        });

        // Attach editor to cell
        cell.element.data("editor", editor);

        // Editor keyboard events
        editor.on('focus', function( ev ) {
            Jupyter.notebook.keyboard_manager.disable();
            $(".cke_top").show();
        });
        editor.on('blur', function( ev ) {
            Jupyter.notebook.keyboard_manager.enable();
        });
        cell.element.find(".inner_cell").dblclick(function(event) {
            is_wysiwyg_mode(cell) ? event.stopPropagation() : {};
        });

        // Save editor changes to model
        editor.on('change', function( ev ) {
            $(editor.element.$).find(".anchor-link").remove();
            var cellData = editor.getData();
            $(editor.element.$).closest(".cell").data("cell").code_mirror.setValue(cellData);
        });

        // Change status
        toggle_button_mode(cell);
    }

    /**
     * Gracefully tear down the CKEditor instance used for WYSIWYG mode
     *
     * @param cell
     */
    function disable_wysiwyg_mode(cell) {
        // Get editor instance
        var editor = cell.element.data("editor");
        if (!editor) {
            console.log("ERROR: Could not get editor instance to destroy");
            return;
        }

        // Destroy the editor instance
        editor.destroy();

        // Change status
        toggle_button_mode(cell);
    }

    function toggle_button_mode(cell) {
        var status = cell.element.find(".wysiwyg-status");
        if (is_wysiwyg_mode(cell)) {
            status.removeClass("wysiwyg-on");
            status.addClass("wysiwyg-off");
            status.find("i").removeClass("fa-file-code-o");
            status.find("i").addClass("fa-file-text-o");
            status.attr("title", "Rich Text Editing")
        }
        else {
            status.removeClass("wysiwyg-off");
            status.addClass("wysiwyg-on");
            status.find("i").removeClass("fa-file-text-o");
            status.find("i").addClass("fa-file-code-o");
            status.attr("title", "Markdown Editing")
        }
    }

    /**
     * Check to see if WYSIWYG mode is turned on for the given cell
     *
     * @param cell - Jupyter cell object for WYSIWYG mode
     * @returns {boolean}
     */
    function is_wysiwyg_mode(cell) {
        // Get the status message of the cell
        var status = cell.element.find(".wysiwyg-status");

        // Return error if no status message
        if (status.length < 1) {
            console.log("ERROR: Could not get WYSIWYG status for cell");
            return false;
        }

        // Return status
        return status.hasClass("wysiwyg-on");
    }

    /**
     * Show the WYSIWYG buttons
     *
     * @param cell - Jupyter cell object for WYSIWYG mode
     */
    function show_wysiwyg_button(cell) {
        cell.element.find(".wysiwyg-toggle").show();
        cell.element.find(".wysiwyg-done").show();
    }

    /**
     * Hide the WYSIWYG buttons
     *
     * @param cell - Jupyter cell object for WYSIWYG mode
     */
    function hide_wysiwyg_button(cell) {
        cell.element.find(".wysiwyg-toggle").hide();
        cell.element.find(".wysiwyg-done").hide();
    }

    /**
     * Attach a WYSIWYG mode button to a cell, if that cell if of the Markdown type and rendered.
     * Gracefully ignore any cells that are not rendered or which are of an incorrect type.
     *
     * @param cell - Jupyter cell object for WYSIWYG button
     */
    function add_wysiwyg_button(cell) {
        if (cell.cell_type === "markdown" && cell.rendered) {
            // Get the blank left area
            var blank_area = cell.element.find(".input_prompt");

            // Create the wrapper div
            var wrapper = $("<div></div>")
                .css("position", "relative")
                .css("top", -6)
                .css("display", "block")
                .css("width", "100%")
                .css("text-align", "center");

            // Create the WYSIWYG toggle button
            var wysiwyg_button = $("<button></button>")
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
                .hide();

            var done_button = $("<button></button>")
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
                .hide();

            // Append the buttons to the UI
            wrapper.append(wysiwyg_button);
            wrapper.append(done_button);
            blank_area.append(wrapper)
        }
    }

    /**
     * Attach WYSIWYG mode buttons to all existing cells in the notebook.
     * Used when loading a notebook.
     */
    function attach_buttons() {
        var all_cells = Jupyter.notebook.get_cells();
        $.each(all_cells, function(i, cell) {
            add_wysiwyg_button(cell);
        });
    }

    /**
     * Load the WYSIWYG nbextension
     */
    function load_ipython_extension() {
        // Attach WYSIWYG buttons to existing cells when a notebook is loaded
        attach_buttons();

        // Attach WYSIWYG button when a new cell is created
        $([Jupyter.events]).on('create.Cell', function(event, target) {
            add_wysiwyg_button(target.cell);
            setTimeout(function() {
                if (!target.cell.rendered) show_wysiwyg_button(target.cell);
            }, 100);
        });
        $([Jupyter.events]).on('edit_mode.Cell', function(event, target) {
            show_wysiwyg_button(target.cell);
        });
        $([Jupyter.events]).on('command_mode.Cell', function(event, target) {
            if (target.cell.rendered) hide_wysiwyg_button(target.cell);
        });
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});