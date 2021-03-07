
const updateTarifInfo = function() {
          $.getJSON("https://api.corrently.io/core/tarif?&zip="+$('#zipcode').val(),function(data) {
            $('#cgp').val((data[0].ap).toLocaleString());
            $('#hap').html((data[0].ap).toLocaleString());  
            $('#hgp').html((data[0].gp).toLocaleString());
            $('#cap').val((data[0].gp).toLocaleString());               
            $('#place').val(data[0].city);
         $('#modeur').html(Math.round(((($('#kwhSel').val()*data[0].ap)/100)/12)+data[0].gp)+1);  
              window.teur=(Math.round(((($('#kwhSel').val()*data[0].ap)/100)/12)+data[0].gp)+1)*12;
        }); 
    }
$(document).ready(function() {
   if(typeof gtag !== 'undefined') {
          gtag('event', 'conversion', {'send_to': 'AW-824211645/TUrZCMStku4BEL3xgYkD'});     
   }
   $('.tarifchk').change(function() {
    updateTarifInfo();
   }); 
    updateTarifInfo();
    $('#submit-strom').click(function() {
        tdconv('init', '2280758', {'element': 'iframe' });
        tdconv('track', 'sale', {'transactionId':window.mwivid, 'ordervalue': window.teur, 'voucher':$('#sponsorcode').val(), 'currency':'EUR', 'event':407989});
        
    })
});
window.updateTarif = setInterval(function() {
    if(typeof $ !== 'undefined') {
        if($('#cgp').val().length < 1) {
            updateTarifInfo();    
        } else {
            clearInterval(window.updateTarif);   
        }        
    }
    updateTarifInfo();
},1000);

(function(i,s,o,g,r,a,m){i['TDConversionObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script', 'https://svht.tradedoubler.com/tr_sdk.js?org=2280758&prog=315215', 'tdconv');
