# WYSIWYG HTML/Markdown Editor for Jupyter Notebook

This is an nbextension that enables WYSIWYG editing functionality for HTML/Markdown cells in Jupyter.

> ***NOTE:*** Currently the automated install through PIP does not work properly. There is an issue with maximum subdirectory depth 
> that our dependency on CKEditor does not play nicely with. We are working on resolving the issue, but until it is resolved, 
installing this nbextension will have to be performed manually.

## Installing

This extension can be installed through PIP.

> pip install jupyter-wysiwyg

## Enabling

This extension can be enabled in Jupyter Notebook by running the following on the command line:

> jupyter nbextension install --py jupyter_wysiwyg

> jupyter nbextension enable --py jupyter_wysiwyg
