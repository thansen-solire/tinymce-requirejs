require.config({
  urlArgs: 'bust=' + (new Date()).getTime(),
  waitSeconds: 15,
  paths: {
    jquery: 'bower_components/jquery/dist/jquery.min',
    tinyMCE_source: 'bower_components/tinymce/tinymce.min',
    tinyMCE: 'bower_components/bower-tinymce-amd/tinyMCE'
  }
});

require(
  ['jquery', 'tinyMCE'],
  function ($, tinyMCE) {
    var s = {
      entity_encoding: 'raw',
      plugins: [
        'autolink link'
      ],
      menubar: false,
      statusbar: false,
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist',
    };
    tinymce.init({});

    $(function(){
      var
        ed = null,
        createEd = function(){
          ed = tinyMCE.createEditor('inst1', s);
          ed.render();
        }
      ;

      createEd();

      $('input#createInst1').click(function(){
        createEd();
        $('div#controls1').show();
        $('div#controls2').hide();
      });

      $('input#removeInst1').click(function(){
        ed.remove();
        $('div#controls1').hide();
        $('div#controls2').show();
      });

      $('input#toggleInst1').click(function(){
        if (ed.isHidden()) {
          ed.show();
        } else {
          ed.hide();
        }
      });
    });
  }
);
