# Copyright (c) Regents of the University of California & the Broad Institute.
# Distributed under the terms of the Modified BSD License.

import json
from pathlib import Path

__all__ = ["__version__"]


def _fetch_version():
    HERE = Path(__file__).parent.resolve()

    for settings in HERE.rglob("package.json"): 
        try:
            with settings.open() as f:
                return json.load(f)["version"]
        except FileNotFoundError:
            pass

    raise FileNotFoundError(f"Could not find package.json under dir {HERE!s}")


__version__ = _fetch_version()
