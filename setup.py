from distutils.core import setup
import os


def get_data_files():
    directory = 'jupyter_wysiwyg/static'
    paths = []
    for (path, directories, filenames) in os.walk(directory):
        for filename in filenames:
            alt_path = path.replace('jupyter_wysiwyg/static', 'share/jupyter/nbextensions/jupyter_wysiwyg')
            paths.append(
                (alt_path, [os.path.join(path, filename)],)
            )
    return paths


setup(name='jupyter-wysiwyg',
      packages=['jupyter_wysiwyg'],
      version='0.1.6',
      description='WYSIWYG editing functionality for markdown/HTML cells in Jupyter',
      license='BSD',
      author='Thorin Tabor',
      author_email='thorin@broadinstitute.org',
      url='https://github.com/genepattern/jupyter-wysiwyg/tree/master/wysiwyg',
      download_url='https://github.com/genepattern/jupyter-wysiwyg/archive/0.1.6.tar.gz',
      keywords=['genepattern', 'wysiwyg', 'ipython', 'jupyter'],
      classifiers=[
          'Development Status :: 4 - Beta',
          'Intended Audience :: Science/Research',
          'Intended Audience :: Developers',
          'License :: OSI Approved :: BSD License',
          'Programming Language :: Python',
          'Framework :: IPython',
      ],
      install_requires=[
          'jupyter',
          'notebook>=4.2.0',
      ],
      package_dir={'jupyter_wysiwyg': 'jupyter_wysiwyg'},
      package_data={'jupyter_wysiwyg': ['static/*',
                                        'static/*/*',
                                        'static/*/*/*',
                                        'static/*/*/*/*',
                                        'static/*/*/*/*/*',
                                        'static/*/*/*/*/*/*']},
      data_files=get_data_files(),
      )
