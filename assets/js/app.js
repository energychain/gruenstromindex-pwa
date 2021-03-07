$ = jQuery;
$(document).ready(function() {
    let  sko = $('#customsko').attr('stromkonto');  
    let  zip = $('#customsko').attr('plz'); 
    
    $('#hknchart').correntlyHKNChart(zip);
    window.sko_link = sko;
    $.getJSON("https://api.corrently.io/v2.0/stromkonto/balances?account="+window.sko_link,function(data) {
        for (const [key, value] of Object.entries(data)) {
                if(value.variation == 'co2') {
                    let xa = 0;
                 if((value.soll/value.haben) < 1) xa=100;
                 $('#co2_bilanz_kg').html(Math.round(value.haben/1000).toString().replace('.',','));
                $('#co2_haben_kg').html(Math.round(value.soll/1000).toString().replace('.',','));
                $('#co2_ratio').html(((Math.round((value.soll/value.haben)*1000)/10)+xa).toFixed(1).replace('.',',')); 
                }
            if(value.variation=='baeume') {
             $('#trees_balance_de').html(value.saldo);
                if(value.saldo == 1) {
             $('#trees_balance_de').html("einem");
             $('#trees_plural_de').html("Baum");
           } else {
             $('#trees_balance_de').html(value.saldo);
             $('#trees_plural_de').html("Bäumen");
           }
            }
        }
            console.log(data);
           if(typeof data.errorMessage != "undefined") {
             console.log("try errCB()");
             if(typeof errCB == "function") {
               errCB();
             }
           }
           
    });
});