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
    jqueryCookie : {
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
      log = function(str){
        var div = $('<div>'),
            now = new Date();

        if (typeof str === 'object') {
          str = JSON.stringify(str);
        }

        if (!str) {
          str = $('<i>').text('empty');
        }

        div
          .append($('<h6>').text(
            now.getHours() + ':' +
            now.getMinutes() + ':' +
            now.getSeconds()
          ))
          .append($('<pre>').html(str))
        ;

        $('div#log').prepend(div);
      },
      memoryStr = $.cookie('form'),
      memory = [
        {
          name :'message',
          value :''
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

      $('input#clearLog').click(function(e){
        $('div#log').html('');
      });

      $('input#createInst1').click(function(){
        createEd();
        $('div#controls1').show();
        $('div#controls2').hide();
      });

      $('input#checkInst1').click(function(){
        log($('textarea#inst1').val());
      });
      $('input#updateInst1').click(function(){
        ed.save();
        log($('textarea#inst1').val());
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
        save = JSON.stringify($(this).serializeArray());
        log(save);
        $.cookie('form', save);
      });
    });
  }
);
