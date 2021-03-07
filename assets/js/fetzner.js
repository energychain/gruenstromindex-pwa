$(document).ready(function() {    
    
    const loadTarif  = function() {
       if($('#zipcode').val().length==5) {
               $.getJSON(
      "https://api.corrently.io/core/tarif?&zip=" + $("#zipcode").val(),
      function (data) {
         chkModal();
        if (typeof data[0] == "undefined" || data[0].ap == 0) {
          $("#zipcode").focus();
        } else {
          $("#modAP").html(data[0].ap.toLocaleString());
          $("#modGP").html(data[0].gp.toLocaleString());
          $('#Ort').val(data[0].city);
          $("#modeur").html(
            Math.round(
              ($("#kwhSel").val() * data[0].ap) / 100 / 12 + data[0].gp
            ) + 1
          );
          $("#modkwh").html($("#kwhSel").val());
          $(".angebotlink").attr(
            "href",
            "https://www.corrently.de/service/angebot-strom.html?vid=" +
              window.mwivid
          );
        }
      }
    );
        if (typeof window._paq != "undefined") {
               window._paq.push(["trackEvent", "level", "attention"]);               
            }
       }
    }
    const chkModal = function() {
        let show=true;
        if($('#zipcode').val().length !== 5) show =false;
        if($('#kwhSel').val()*1 < 1) show = false;
        if(show) {
            $("#thanksLead-1").modal();  
            loadTarif();
        }
    }
    $('#fetzbutton').click(function() {
       chkModal(); 
    });
    $('#fetzform').submit(function() {
       $("#thanksLead-1").modal();    
        chkModal();
    });
    $(".psel").click(function () {
      $("#kwhSel").val($('input[name="personen"]:checked').val());
         chkModal();    
    });
    $('#zipcode').change(loadTarif);   
    $('#zipcode-1').change(loadTarif);
});