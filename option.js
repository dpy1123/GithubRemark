(function(){
	$('input[name=userId]').val(localStorage.userId);

	$('#save').on('click', function(){
		var newId = $('input[name=userId]').val();
		localStorage.userId = newId;
	});

})();