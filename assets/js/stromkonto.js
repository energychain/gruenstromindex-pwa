$('.helptxt').click(function() {
    $('.helptxt').toggle();
})
window.gsimap = function(q) {
    $('.gsiloaded').hide();
    $('.gsinozip').hide();
    if(q==null) {
        if(typeof $.getUrlVar("p") !== 'undefined') {
            window.gsimap($.getUrlVar("p"));
        } else
        if(typeof $.getUrlVar("q") !== 'undefined') {
            window.gsimap($.getUrlVar("q"));
        } else
        if(typeof $.getUrlVar("plz") !== 'undefined') {
            window.gsimap($.getUrlVar("plz"));
        } else
        if(typeof $.getUrlVar("zip") !== 'undefined') {
            window.gsimap($.getUrlVar("zip"));
        } else
        if(typeof $.getUrlVar("zipcode") !== 'undefined') {
            window.gsimap($.getUrlVar("zipcode"));
        } else {
            $('.gsinozip').show();
        }
    } else {
        $('.gsinozip').hide();
        $('#gsichart').correntlyGSI(q);
        $('#hknchart').correntlyHKNChart(q);
        $('#apiurls').append('Dispatch/Stromherkunft: <br/><pre>'+"https://api.corrently.io/v2.0/gsi/dispatch?zip="+q+'</pre>');     
        $.getJSON("https://api.corrently.io/v2.0/gsi/dispatch?zip="+q,function(data) {
                    $('.gsiloaded').show();
                    var heatMapData = [];
                   $('#fortext').html(data.center.city); $('#kmdistance').html(data.avg_distance_km.toFixed(1).replace('.',','));
                    for(let i=0;i<data.dispatch_from.length;i++) {
                      heatMapData.push({
                        location: new google.maps.LatLng(data.dispatch_from[i].location.coordinates[1], data.dispatch_from[i].location.coordinates[0]) ,
                        weight:data.dispatch_from[i].energy*1000
                      });
                    }

                    var center = new google.maps.LatLng(data.center.coordinates[1], data.center.coordinates[0]);

                    map = new google.maps.Map(document.getElementById('map'), {
                      center: center,
                      zoom: 11,
                      mapTypeId: 'hybrid'
                    });

                    var heatmap = new google.maps.visualization.HeatmapLayer({
                      data: heatMapData
                    });

                    var marker = new google.maps.Marker({
                      position: center,
                      title: 'Home'
                    });

                    heatmap.setMap(map);
                    heatmap.set('radius', 60);
                    marker.setMap(map);
        });
    }
}
window.stromkontoapp = function() {
    let stromkonto = $.getUrlVar("a");
    if(typeof stromkonto == 'undefined') {
        if(window.localStorage.getItem("account") !== null) {
            stromkonto = window.localStorage.getItem("account");
        }
    }
    if((typeof stromkonto !== 'undefined') && (stromkonto!== null)) {
        window.localStorage.setItem("account",stromkonto);
    }
    if((typeof stromkonto == 'undefined') || (stromkonto == null) || (stromkonto.length < 5)) {
        if(typeof _pag !== 'undefined') {
                                _paq.push(['trackEvent', 'Stromkonto', 'NewSession']);                                
                            }
        $('#mlogin').modal();
        $('#skologin').submit(function( event ) {
                console.log('Form Submit');
                $('#email').val($('#skoemail').val());
                let datastring = $("#skologin").serialize();
                $.ajax({
                  type: "POST",
                  url: "https://api.corrently.io/v2.0/stromkonto/login",
                  data: datastring,
                  dataType: "json",
                  success: function (data) {
                    if((data.status !== 'unregistered') && (typeof data.stromkonto !== 'undefined') && (data.stromkonto.length > 5)) {
                     window.localStorage.setItem("account",data.stromkonto);
                      $('#memail').modal();
                      $('#mlogin').modal('hide');
                        if(typeof _pag !== 'undefined') {
                                _paq.push(['trackEvent', 'Stromkonto', 'Login']);                                
                            }
                    } else {
                        $('#emailreg').val($('#skoemail').val());
                        $('#mlogin').modal('hide');
                        $('#mregi').modal();
                        $('#fregi').submit(function(event) {
                            $('#bemail').val($('#skoemail').val());
                            datastring = $("#fregi").serialize();
                              $.ajax({
                                  type: "POST",
                                  url: "https://api.corrently.io/v2.0/stromkonto/register",
                                  data: datastring,
                                  dataType: "json",
                                  success: function (data) {
                                      $('#memail').modal();
                                  }
                              });                            
                            $('#mregi').modal('hide');
                            if(typeof _pag !== 'undefined') {
                                _paq.push(['trackEvent', 'Stromkonto', 'Register']);                                
                            }
                            event.preventDefault();
                        })
                    }
                  },
                  error: function () {},
                });
             event.preventDefault();
        });
    }
    $('.co2,.baeume,.eigenstrom,.erzeugung,.gsz').addClass('disabled');
   $('#apiurls').append('Ledger Stromkonto: <br/><pre>'+"https://api.corrently.io/v2.0/stromkonto/balances?account="+stromkonto+'</pre>'); 
    $.getJSON("https://api.corrently.io/v2.0/stromkonto/balances?account="+stromkonto,function(data) {  
        if(stromkonto == '0x7866f187f30cd52Bdbd5c4184fD3ee6168Ae0dB4') {
            $('#demoalert').show();
        } else {
            $('#demoalert').hide();
        }
        let submeterHTML = '';
        for(let i=0;i<data.length;i++) {
             $('.'+data[i].variation).removeClass('disabled');
            if(data[i].variation == 'gsi') {                
                window.gsimap(data[i].zipcode);                                 
            }            
            if(data[i].variation == 'co2') {
                if(data[i].saldo < 0) {
                    $('#negco2info').show();
                    $('#negaKWH').html(Math.round(Math.abs(data[i].saldo/0.035)));
                }
            }
            if(data[i].variation == 'submeter') {
                submeterHTML += '<tr>';
                submeterHTML += '<td>' + data[i].name + '</td>';
                submeterHTML += '<td style="text-align:right">' + (data[i].soll/1000).toFixed(3).replace('.',',') + ' kWh</td>';
                submeterHTML += '<td style="text-align:right">' + (data[i].haben/1000).toFixed(3).replace('.',',') + ' kWh</td>';
                submeterHTML += '<td style="text-align:right">' + (data[i].saldo/1000).toFixed(3).replace('.',',') + ' kWh</td>';
                submeterHTML += '<td style="text-align:right">' + (data[i].gsb/1000).toFixed(3).replace('.',',') + ' kWh</td>';
                submeterHTML += '<td style="text-align:right">' + (data[i].co2/1000).toFixed(3).replace('.',',') + ' kg</td>';
                submeterHTML += '</tr>';
            }
            $.each(data[i], function( index, value ) {                
                if((data[i].variation == 'gsb') || (data[i].variation == 'gsz') || (data[i].variation == 'eigenstrom') || (data[i].variation == 'co2')) {
                    if((index=='soll')||(index=='haben')||(index=='saldo')) {
                        value=(value/1000).toFixed(3).replace('.',',');
                    }
                }
                $('.'+data[i].variation+'[data="'+index+'"]').html(value);                
            }); 
            if(typeof data[i].txs !== 'undefined') {
                data[i].txs.sort((a,b) => (a.timeStamp < b.timeStamp) ? 1 : ((b.timeStamp < a.timeStamp) ? -1 : 0)); 
                
                let html = '<table class="table table-condensed">';
                html+='<tr class="d-flex"><th class="col-2">Datum</th><th class="col-8">Beschreibung</th><th class="col-2" align="right" style="text-align:right">Wert</th></tr>';
                let preV = data[i].saldo;
                if(typeof window.pageMore == 'undefined') {
                    window.pageMore = {};
                }
                if(typeof window.pageMore[data[i].variation] == 'undefined') {
                    window.pageMore[data[i].variation] = 0;
                }
                if(data[i].variation == 'gsb') {
                    if(data[i].txs.length>1) {
                        let delta_ts = data[i].txs[0].timeStamp - data[i].txs[1].timeStamp;
                        let delta_v = data[i].txs[0].value;
                        let delta_cap = 35000 - data[i].saldo;
                        let delta_gap = (delta_cap/delta_v)*delta_ts;             let delta_hrs = delta_gap/3600000;
                         $('#countdownGSB').html((delta_hrs).toFixed(1).replace('.',',')+" Stunden");
                    }
                }
                for(let j=0;(j<data[i].txs.length)&&(j<24);j++) {
                    preV -=  data[i].txs[j].value;
                    if((data[i].variation == 'gsb') || (data[i].variation == 'gsz') || (data[i].variation == 'eigenstrom')||(data[i].variation == 'co2')) {                   
                        data[i].txs[j].value=(data[i].txs[j].value/1000).toFixed(3).replace('.',',');                    
                    }
                    let topclass = 'less8';
                    if(j<8) topclass = 'top8';
                    html+="<tr class='d-flex "+topclass+"'>";
                    html+="<td class='col-2' title='"+data[i].txs[j].txid+"'>"+new Date(data[i].txs[j].timeStamp).toLocaleString()+"</td>";
                    html+="<td class='col-8' title='Geprüft: "+data[i].txs[j].cashier+"'>"+data[i].txs[j].txt+"</td>";
                    html+="<td class='col-2' align='right' style='text-align:right'>"+data[i].txs[j].value+"</td>";
                    html+="</tr>";
                }
                html+="<tr class='d-flex'><td  class='col-2'>&nbsp;</td><td class='col-8 text-muted'>aus vorhergehenden Transaktionen</td>";
                if((data[i].variation == 'gsb') || (data[i].variation == 'eigenstrom')) {
                    preV=(preV/1000).toFixed(3).replace('.',',');
                }
                html+="<td class='col-2 text-muted' style='text-align:right'>"+preV+"</td></tr>";
                html+="</table>";
                $('.'+data[i].variation+'[data="txtable"]').html(html);
            }            
             if(typeof data[i].assets !== 'undefined') {                                                
                let html = '<table class="table table-condensed">';
                html+='<tr class="d-flex"><th class="col-5">Erzeugungsanlage</th><th class="col-5">Betreiber/Emitent</th><th class="col-2" align="right" style="text-align:right">Anteile (kwha)</th></tr>';
                for(let j=0;(j<data[i].assets.length)&&(j<50);j++) {
                    html+="<tr class='d-flex'>";
                    html+="<td class='col-5' title='"+data[i].assets[j].account+"'>"+data[i].assets[j].asset_title+"</td>";
                    html+="<td class='col-5' title='Vertragskennung: "+data[i].assets[j].asset_contract+"'>"+data[i].assets[j].asset_emitent+"</td>";
                    html+="<td class='col-2' align='right' style='text-align:right'>"+data[i].assets[j].shares+"</td>";
                    html+="</tr>";
                }
                 html+="</table>";                                  
                $('.'+data[i].variation+'[data="assettable"]').html(html);                 
             }
        }
        $('#submeterTable').html(submeterHTML);
    });
    
    function onHashChange() {
        var hash = window.location.hash;

        if (hash) {
            // using ES6 template string syntax
            $(`[data-toggle="tab"][href="${hash}"]`).trigger('click');
        }
    }

    window.addEventListener('hashchange', onHashChange, false);
    onHashChange();
};

$(document).ready(function() {
    try {
        if((location.pathname.indexOf("gruenstromindex") > 0)||(document.title.indexOf("GrünstromIndex")>-1)||(location.pathname.indexOf("entfernung") > 0)) {
            window.gsimap();
        } else {
            window.stromkontoapp();
        }
    } catch(e) {
        console.log(e);
    }
});

$('.modbut').click(function() {
   $('#apiinfo').modal(); 
});
$('.gsbChkOut').click(function() {    
     var stripe = Stripe('pk_live_rWnhwGfKnwm2aMYyQ50SbZrl');    
     stripe.redirectToCheckout({
      items: [        
        {sku: 'sku_FPdNXJvUGdZ1hi', quantity: 1}
      ],
      successUrl: 'https://corrently.de/service/stromkonto.html',
      cancelUrl: 'https://corrently.de/service/stromkonto.html',
      clientReferenceId: window.ce_zip
    }).then(function (result) {
    });         
});
$('.baumChkOut').click(function() {    
     var stripe = Stripe('pk_live_rWnhwGfKnwm2aMYyQ50SbZrl');    
     stripe.redirectToCheckout({
      items: [        
        {sku: 'sku_IiYzSpflKmbtJ3', quantity: 1}
      ],
      successUrl: 'https://corrently.de/service/stromkonto.html',
      cancelUrl: 'https://corrently.de/service/stromkonto.html',
      clientReferenceId: window.ce_zip
    }).then(function (result) {
    });         
});