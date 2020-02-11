# Dockerfile for running Jupyter with the WISIWYG editor

FROM jupyter/scipy-notebook
MAINTAINER Thorin Tabor <tmtabor@cloud.ucsd.edu>
EXPOSE 8888

#############################################
##      Install and enable the editor      ##
#############################################

RUN pip install jupyter-wysiwyg
RUN jupyter nbextension install --user --py jupyter_wysiwyg
RUN jupyter nbextension enable --py jupyter_wysiwyg
