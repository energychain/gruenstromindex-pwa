$(document).ready(function() {
    $('.psel').click(function() {
        $('#kwhSel').val($('input[name="personen"]:checked').val());
    });
    $('.leadform').ajaxForm(function() {
        $.getJSON("https://api.corrently.io/core/tarif?&zip="+$('#zipcode').val,function(data) {
            $('#modAP').html((data[0].ap).toLocaleString());
            $('#modGP').html((data[0].gp).toLocaleString());
        });
       $('#thanksLead').modal();
    });
})