$('#meetButton').click(function() {
	$.getJSON("/api/stromdao/meet?email="+encodeURI($('#meetEmailInput').val()),function(data) { 
		$('#roomHrefId').attr('href',data.roomurl); 
		$('#roomHrefId').html(data.roomurl);
		$('#roomModal').modal();
	});
});