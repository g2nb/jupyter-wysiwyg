module.exports = [{
    id: 'jupyter_wysiwyg',
    autoStart: true,
    activate: function(app) {
      console.log('JupyterLab extension jupyter_wysiwyg is activated!');
      console.log(app.commands);
    }
}];