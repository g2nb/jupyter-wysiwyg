# Rich Text HTML/Markdown Editor for JupyterLab

This is an nbextension that enables WYSIWYG editing functionality for HTML/Markdown cells in Jupyter.

## Requirements

* JupyterLab >= 3.0
* ipywidgets >= 7.0.0

## Installing

This extension can be installed through PIP.

```bash
pip install jupyter-wysiwyg
```

***OR***

```bash
# Clone the jupyter-wysiwyg repository
git clone https://github.com/g2nb/jupyter-wysiwyg.git
cd jupyter-wysiwyg 

# Install the jupyter-wysiwyg JupyterLab prototype
pip install -e .
jupyter labextension develop . --overwrite
```

## Development

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in 
the extension's source and automatically rebuild the extension. To develop, run each of the following commands in a 
separate terminal. 

```bash
jlpm run watch
jupyter lab
```

The `jlpm` command is JupyterLab's pinned version of [yarn](https://yarnpkg.com/) that is installed with JupyterLab. You 
may use `yarn` or `npm` in lieu of `jlpm`.

With the watch command running, every saved change will immediately be built locally and available in your running 
JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the 
extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using 
the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```
