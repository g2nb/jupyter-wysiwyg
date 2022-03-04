# WYSIWYG HTML/Markdown Editor for Jupyter Notebook

This is an nbextension/labextension that enables WYSIWYG editing functionality for HTML/Markdown cells in Jupyter.

> The extension for Jupyter Notebook can be found in the master branch. The JupyterLab version is found in the lab branch.

## Installing

This extension can be installed through either PIP or conda.

> pip install jupyter-wysiwyg

> conda install -c g2nb jupyter-wysiwyg

## Enabling

To enable this extension in Jupyter Notebook 5.2 and earlier you will need to run the following command lines. 

In Jupyter Notebook 5.3 and later, this is automatic and will not be necessary.

> jupyter nbextension install --py jupyter_wysiwyg

> jupyter nbextension enable --py jupyter_wysiwyg

## Using the Editor

To use the WYSIWYG editor, first create a markdown cell, then select the cell. You should now see two buttons appear on the left side of the cell. These buttons will have the "Rich Text Editing" and "Run Cell" tooltips. Click the "Rich Text Editing" button to launch the editor.
