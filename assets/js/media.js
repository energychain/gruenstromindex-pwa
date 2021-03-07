$.getJSON("https://corrently.de/api/stromdao/media",function(data) {
   let html = '';
   for(let i=0;i<data.length;i++) {
       html+='<div class="container" style="background:#ffffff">'
       html+='<div class="row">';
       html+='<div class="col" style="background: #fda824;min-width: 250px;min-height: 250px;padding-top: 0px;">';
       html+='<h1 style="color: rgb(255,255,255);padding: 30px;font-size: 60px;">'+data[i].network+'</h1>';
       html+='<p>'+new Date(data[i].timeStamp).toLocaleString()+'</p>';
       html+='</div>';
       html+='<div class="col">';
        html+='<p style="padding-left: 30px;font-family: Assistant, sans-serif;">'+data[i].text+'</p>';     
         html+='<a href="'+data[i].url+'" target="_blank" class="btn btn-primary btn-sm" style="font-family: \'DIN Alternate Bold\';background-color: rgb(253,168,37);color: rgb(255,255,255);font-size: 20px;border-radius: 80px;">öffnen</a>'
        html+='</div>';
        html+='</div>';
       html+="</div>";
   } 
    $('#medialist').html(html);
});