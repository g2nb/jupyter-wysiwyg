# First Time

1. Make sure you have twine and build installed:
> pip install twine build
2. Make sure you have added your [PyPI credentials](https://docs.python.org/3.3/distutils/packageindex.html#pypirc) to `~/.pypirc`
3. Make sure you have anaconda-client installed:
> conda install anaconda-client
4. Log into Anaconda Cloud
> anaconda login

# How to Deploy to PyPi Test

1. Make sure that the version number is updated in `package.json`.
2. Navigate to the directory where the repository was checked out:
> cd jupyter-wysiwyg
3. Remove any residual build artifacts from the last time jupyter-wysiwyg was built. This step is not necessary the first time the package is built.
> rm dist/\*.tar.gz; rm dist/\*.whl
4. Build the sdist and wheel artifacts.
> python -m build .
5. Upload the files by running:
> twine upload -r pypitest dist/\*.tar.gz; twine upload -r pypitest dist/\*.whl
6. If the upload fails go to [https://testpypi.python.org/pypi](https://testpypi.python.org/pypi) and manually upload dist/jupyter-wysiwyg-*.tar.gz.
7. Test the deploy by uninstalling and reinstalling the package: 
> pip uninstall jupyter-wysiwyg;
> pip install -i https://test.pypi.org/simple/ jupyter-wysiwyg

# How to Deploy to Production PyPi

1. First deploy to test and ensure everything is working correctly (see above).
2. Make sure that the version number is updated in `package.json`.
3. Navigate to the directory where the repository was checked out:
> cd jupyter-wysiwyg
4. Remove any residual build artifacts from the last time jupyter-wysiwyg was built. This step is not necessary the first time the package is built.
> rm dist/\*.tar.gz; rm dist/\*.whl
5. Build the sdist and wheel artifacts.
> python -m build .
6. Upload the files by running:
> twine upload dist/\*.tar.gz; twine upload dist/\*.whl
7. If the upload fails go to [https://testpypi.python.org/pypi](https://testpypi.python.org/pypi) and manually upload dist/jupyter-wysiwyg-*.tar.gz.
8. Test the deploy by uninstalling and reinstalling the package: 
> pip uninstall jupyter-wysiwyg;
> pip install jupyter-wysiwyg

# How to Deploy to Conda

1. Deploy to Production PyPi
2. Navigate to Anaconda directory
> cd /anaconda3
3. Activate a clean environment.
> conda activate clean
4. Run the following, removing the existing directory if necessary:
> conda skeleton pypi jupyter-wysiwyg --version XXX
5. Build the package:
> conda build jupyter-wysiwyg
6. Converting this package to builds for other operating systems can be done as shown below. You will need to upload each
built version using a separate upload command.
> conda convert --platform all /anaconda3/conda-bld/osx-64/jupyter-wysiwyg-XXX-py37_0.tar.bz2 -o conda-bld/
7. Upload the newly built package:
> anaconda upload /anaconda3/conda-bld/*/jupyter-wysiwyg-XXX-py37_0.tar.bz2 -u g2nb
8. Log into the [Anaconda website](https://anaconda.org/) to make sure everything is good.

# How to deploy to NPM

1. Make sure that the version number is updated in `package.json`.
2. Navigate to the directory where the repository was checked out:
> cd jupyter-wysiwyg
3. Log in to NPM is necessary
> npm login
4. Build and upload the package. Be prepared to enter a two-factor authentication code when prompted.
> npm publish