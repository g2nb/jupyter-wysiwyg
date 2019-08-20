from setuptools import setup
import os


# Read version and other metadata from file
__version__ = '19.08'


with open('README.md') as f:
    long_description = f.read()


def get_data_files():
    directory = 'jupyter_wysiwyg/static'
    paths = []
    for (path, directories, filenames) in os.walk(directory):
        for filename in filenames:
            alt_path = path.replace('jupyter_wysiwyg/static', 'share/jupyter/nbextensions/jupyter_wysiwyg')
            paths.append(
                (alt_path, [os.path.join(path, filename)],)
            )

    paths.append(('etc/jupyter/nbconfig/notebook.d', ['jupyter_wysiwyg.json']),)
    return paths


setup(name='jupyter-wysiwyg',
      packages=['jupyter_wysiwyg'],
      version=__version__,
      long_description=long_description,
      long_description_content_type="text/markdown",
      description='WYSIWYG editing functionality for markdown/HTML cells in Jupyter',
      license='BSD',
      author='Thorin Tabor',
      author_email='thorin@broadinstitute.org',
      url='https://github.com/genepattern/jupyter-wysiwyg/tree/master/wysiwyg',
      download_url='https://github.com/genepattern/jupyter-wysiwyg/archive/' + __version__ + '.tar.gz',
      keywords=['genepattern', 'wysiwyg', 'ipython', 'jupyter'],
      classifiers=[
          'Development Status :: 5 - Production/Stable',
          'Intended Audience :: Science/Research',
          'Intended Audience :: Developers',
          'License :: OSI Approved :: BSD License',
          'Programming Language :: Python',
          'Framework :: Jupyter',
      ],
      install_requires=[
          'jupyter',
          'notebook>=4.2.0',
      ],
      package_dir={'jupyter_wysiwyg': 'jupyter_wysiwyg'},
      package_data={'jupyter_wysiwyg': ['static/*.js',
                                        'static/tinymce/*.js',
                                        'static/tinymce/*.md',
                                        'static/tinymce/*.css',
                                        'static/tinymce/*/*.js',
                                        'static/tinymce/*/*.css',
                                        'static/tinymce/*/*.png',
                                        'static/tinymce/*/*.gif',
                                        'static/tinymce/*/*/*.js',
                                        'static/tinymce/*/*/*.css',
                                        'static/tinymce/*/*/*.png',
                                        'static/tinymce/*/*/*.gif',
                                        'static/tinymce/*/*/*/*.js',
                                        'static/tinymce/*/*/*/*.css',
                                        'static/tinymce/*/*/*/*.png',
                                        'static/tinymce/*/*/*/*.gif',
                                        'static/tinymce/*/*/*/*/*.js'
                                        'static/tinymce/*/*/*/*/*.css'
                                        'static/tinymce/*/*/*/*/*.png'
                                        'static/tinymce/*/*/*/*/*.gif']},
      data_files=get_data_files(),
      )
