__author__ = 'Thorin Tabor'
__copyright__ = 'Copyright 2016-2018, Regents of the University of California & Broad Institute'
__version__ = '0.2.0'
__status__ = 'Beta'
__license__ = 'BSD'


def _jupyter_server_extension_paths():
    return [{
        "module": "jupyter_wysiwyg"
    }]


def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        src="static",
        dest="jupyter_wysiwyg",
        require="jupyter_wysiwyg/nb")]


def _jupyter_labextension_paths():
    return [{
        'name': 'jupyter_wysiwyg',
        'src': 'static',
    }]


def load_jupyter_server_extension(nbapp):
    nbapp.log.info("jupyter_wysiwyg enabled!")
