$(document).ready(function() {
    $('#btnZuViel').click(function() {
         $('#okmodal').modal();
    });
   $('#frmzuviel').submit(function(e){
      $.getJSON("https://api.corrently.io/core/tarif?&zip="+$('#plz').val(),function(data) {
          $('#okmodal').modal();
      });
    e.preventDefault();
  });
});