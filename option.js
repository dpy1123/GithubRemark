(function () {
	document.querySelector('#userId').value = localStorage.userId;

	document.querySelector('#save').onclick = function () {
		var newId = document.querySelector('#userId').value;
		localStorage.userId = newId;
	};

})();