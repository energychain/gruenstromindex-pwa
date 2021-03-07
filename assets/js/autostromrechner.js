const calcCost = function() { 
 $('#abschlagMob').html(( (($('#kwhamob').val() *  ($('#apmob').val()/100))/12)+($('#gpmob').val()*1) ).toFixed(2).replace('.',','));
}
const calcVerbr = function() {
  $('#kwhamob').val( ($('#kma').val()/100) *  $('#kwh100km').val() );
  calcCost();
}
const loadAutoTarif  = function() {
    if($('#zipcode-1').val().length == 5) {
        $.getJSON("https://api.corrently.io/v2.0/tariff/emobil?zipcode="+$('#zipcode-1').val(),function(data) {
                   $('#Ort-1').val(data[0].cityname);
                   $('#modAP-1').html(data[0].ap.toFixed(2).replace('.',','));
                   $('#modGP-1').html(data[0].gp.toFixed(2).replace('.',','));
                   $('#apmob').val(data[0].ap);
                   $('#gpmob').val(data[0].gp);
                   calcCost();
        })
    }
}

$(document).ready(function() {
    $('#zipcode-1').keydown(function() {       
            loadAutoTarif();       
    });
    $('#zipcode-1').change(function() {       
            loadAutoTarif();       
    });
    $('#kwhamob').keydown(function() {       
            calcCost();       
    });
    $('#kwhamob').change(function() {       
            calcCost();       
    });
    $('#kma').keydown(function() {       
            calcVerbr();       
    });
    $('#kma').change(function() {       
            calcVerbr();       
    });
    $('#kwh100km').keydown(function() {       
            calcVerbr();       
    });
    $('#kwh100km').change(function() {       
            calcVerbr();       
    });
    setTimeout(loadAutoTarif,1000);
    setTimeout(loadAutoTarif,5000);
    loadAutoTarif();
});