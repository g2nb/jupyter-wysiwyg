__author__ = 'Thorin Tabor'
__copyright__ = 'Copyright 2016-2018, Regents of the University of California & Broad Institute'
__version__ = '0.1.9'
__status__ = 'Beta'
__license__ = 'BSD'

def _jupyter_server_extension_paths():
    return [{
        "module": "jupyter_wysiwyg"
    }]

def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        # the path is relative to the `my_fancy_module` directory
        src="static",
        # directory in the `nbextension/` namespace
        dest="jupyter_wysiwyg",
        # _also_ in the `nbextension/` namespace
        require="jupyter_wysiwyg/index")]

def load_jupyter_server_extension(nbapp):
    nbapp.log.info("jupyter_wysiwyg enabled!")