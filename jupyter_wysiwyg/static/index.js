// Add file path shim for Jupyter 3/4
const WYSIWYG_PATH = location.origin + Jupyter.contents.base_url + "nbextensions/jupyter_wysiwyg/";

define([
    "base/js/namespace",
    "jquery",
    WYSIWYG_PATH + "tinymce/tinymce.min.js"], function(Jupyter, $, TinyMCE) {

    function gen_id(prefix) {
        return prefix + '_' + Math.random().toString(36).substr(2, 9);
    }

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
        const textbox = cell.element.find(".text_cell_render");

        // Special case to remove anchor links before editing
        textbox.find(".anchor-link").remove();

        // Special case for placeholder text in empty cells
        if (cell.get_text().length === 0) textbox.empty();

        const id = gen_id('editor');
        textbox.attr('id', id);
        tinymce.init({
            selector: '#' + id,
            content_css : location.origin + Jupyter.contents.base_url + 'static/style/style.min.css',
            branding: false,
            contextmenu: false,
            elementpath: false,
            menubar: false,
            height: 500,
            toolbar: 'styleselect fontsizeselect | bold italic underline strikethrough | subscript superscript | forecolor backcolor emoticons | bullist numlist outdent indent blockquote',
            init_instance_callback: function (editor) {
                editor.on('Change', function (e) {
                    console.log('Editor contents was changed.');
                    const content = editor.getContent();
                    cell.code_mirror.setValue(content);
                });
            }
        }).then(editor => {
            // Attach editor to cell
            cell.element.data("editor", editor[0]);

            // Prevent double-click bug
            cell.element.find(".inner_cell").dblclick(function(event) {
                is_wysiwyg_mode(cell) ? event.stopPropagation() : {};
            });
        }).catch( error => {
            console.error( error );
        });

        // Change status
        toggle_button_mode(cell);
    }

    /**
     * Gracefully tear down the TinyMCE instance used for WYSIWYG mode
     *
     * @param cell
     */
    function disable_wysiwyg_mode(cell) {
        // Get editor instance
        const editor = cell.element.data("editor");
        if (!editor) {
            console.log("ERROR: Could not get editor instance to destroy");
            return;
        }

        // Remove the editor instance
        editor.remove();

        // Force the markdown to render
        cell.unrender();
        cell.render();

        // Change status
        toggle_button_mode(cell);
    }

    function toggle_button_mode(cell) {
        const status = cell.element.find(".wysiwyg-status");
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
        const status = cell.element.find(".wysiwyg-status");

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
            const blank_area = cell.element.find(".input_prompt");

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
                .hide();

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
                .hide();

            // Append the buttons to the UI
            wrapper.append(wysiwyg_button);
            wrapper.append(done_button);
            blank_area.append(wrapper)
        }
    }

    function to_rich_text_cell(former_type) {
        // Convert empty cell, otherwise add a new cell below
        let cell = Jupyter.notebook.get_selected_cell();
        const contents = cell.get_text().trim();
        // Insert a new cell if the current one has contents
        if (contents !== "") {
            cell = Jupyter.notebook.insert_cell_below();
            Jupyter.notebook.select_next();
        }

        // Make sure that the cell has the markdown cell type
        if (cell.cell_type !== 'markdown') Jupyter.notebook.cells_to_markdown();

        // Initialize the rich text editor
        setTimeout(function() {
            cell = Jupyter.notebook.get_selected_cell();
            cell.element.find(".wysiwyg-toggle.wysiwyg-off").click();
        }, 100);
    }

    /**
     * Attach WYSIWYG mode buttons to all existing cells in the notebook.
     * Used when loading a notebook.
     */
    function attach_buttons() {
        const all_cells = Jupyter.notebook.get_cells();
        $.each(all_cells, function(i, cell) {
            add_wysiwyg_button(cell);
        });
    }

    /**
     * Attach WYSIWYG button when a new cell is created
     */
    function attach_events() {
        $([Jupyter.events]).on('create.Cell', function(event, target) {
            add_wysiwyg_button(target.cell);
            setTimeout(function() {
                if (!target.cell.rendered) show_wysiwyg_button(target.cell);
            }, 100);
        });
        $(".text_cell_render").dblclick(function(event) {
            const target = $(event.target).closest(".cell").data("cell");
            setTimeout(function() { show_wysiwyg_button(target); }, 100);
        });
        $([Jupyter.events]).on('edit_mode.Cell', function(event, target) {
            show_wysiwyg_button(target.cell);
        });
        $([Jupyter.events]).on('command_mode.Cell', function(event, target) {
            if (target.cell.rendered) hide_wysiwyg_button(target.cell);
        });
    }

    /**
     * Attach new cell type in menu
     */
    function attach_cell_type() {
        // Add Rich Text "cell type" if not already in menu
        const dropdown = $("#cell_type");
        const rich_text_in_dropdown = dropdown.find("option:contains('Rich Text')").length > 0;
        if (!rich_text_in_dropdown) {
            dropdown.append(
                    $("<option value='code'>Rich Text</option>")
                );

            dropdown.change(function(event) {
                const type = $(event.target).find(":selected").text();
                if (type === "Rich Text") {
                    const former_type = Jupyter.notebook.get_selected_cell().cell_type;
                    to_rich_text_cell(former_type);
                    event.stopPropagation();
                }
            });

            // Ensure that our event is checked first
            const event_array = $._data(dropdown[0], "events").change;
            event_array.unshift(event_array.slice(-1).pop());
        }

        const cell_menu = $("#change_cell_type");
        const rich_text_in_menu = cell_menu.find("#to_rich_text").length > 0;
        if (!rich_text_in_menu) {
            cell_menu.find("ul.dropdown-menu")
                .append(
                    $("<li id='to_rich_text' title='Insert a Rich Text editor cell'><a href='#'>Rich Text</a></option>")
                        .click(function() {
                            to_rich_text_cell();
                        })
                );
        }
    }

    /**
     * Load the WYSIWYG nbextension
     */
    function load_ipython_extension() {
        // Attach WYSIWYG buttons to existing cells when a notebook is loaded
        attach_buttons();

        // Attach WYSIWYG button when a new cell is created
        attach_events();

        // Attach new cell type in menu
        attach_cell_type();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});