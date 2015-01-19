require.config({
  urlArgs: 'bust=' + (new Date()).getTime(),
  waitSeconds: 15,
  paths: {
    jquery: 'bower_components/jquery/dist/jquery.min',
    jqueryCookie: 'bower_components/jquery.cookie/jquery.cookie',
    tinyMCE_source: 'bower_components/tinymce/tinymce.min',
    tinyMCE: 'bower_components/bower-tinymce-amd/tinyMCE'
  },
  shim: {
    jqueryCookie: {
      deps: ['jquery']
    }
  }
});

require(
  ['jquery', 'tinyMCE', 'json2', 'jqueryCookie'],
  function ($, tinyMCE) {
    var
      s = {
        entity_encoding: 'raw',
        plugins: [
          'autolink link'
        ],
        menubar: false,
        statusbar: false,
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist',
      },
      log = function(title, str){
        var div = $('<div>'),
            now = new Date();

        if (typeof str === 'object') {
          str = JSON.stringify(str);
        }

        div
          .append($('<h6>').html(
            now.getHours() + ':' +
            now.getMinutes() + ':' +
            now.getSeconds() + '<br>' + title
          ))
          .append($('<pre>').html(str))
        ;

        $('div#log').prepend(div);
      },
      memoryStr = $.cookie('form'),
      memory = [
        {
          name: 'message',
          value: ''
        }
      ],
      restore = function(){
        $.each(memory, function(ii, row){
          $('form [name=' + row.name + ']').val(row.value);
        });
      };
    tinymce.init({});

    if (memoryStr) {
      memory = JSON.parse(memoryStr);
    }

    $(function(){
      var
        ed = null,
        createEd = function(){
          ed = tinyMCE.createEditor('inst1', s);
          ed.render();
        }
      ;

      restore();
      createEd();

      ed.on('focus', function(e){
        log('editor focused', '');
      });
      ed.on('blur', function(e){
        log('editor blured', '');
      });

      $('input#clearLog').click(function(e){
        $('div#log').html('');
      });

      $('input#createInst1').click(function(){
        createEd();
        $('div#controls1').show();
        $('div#controls2').hide();
      });

      $('input#checkInst1').click(function(){
        log('textarea content', $('textarea#inst1').val());
      });
      $('input#updateInst1').click(function(){
        ed.save();
        log('textarea content', $('textarea#inst1').val());
      });
      $('input#focusInst1').click(function(){
        ed.focus();
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

      $('form').submit(function(e){
        var save = null;

        e.preventDefault();
        ed.save();
        save = JSON.stringify($(this).serializeArray());
        log('memory saved', save);
        $.cookie('form', save);
      });
    });
  }
);
