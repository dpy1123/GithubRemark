function startRecord(){
	chrome.runtime.sendMessage({method: "start"}, function(response){
		if(response.status){
			//console.log('record started!')
			chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
			chrome.browserAction.setBadgeText({text: 'on'});
		}
	})
}

function stopRecord(){
	chrome.runtime.sendMessage({method: "stop"}, function(response){
		if(!response.status){
			//console.log('record stoped!')
			chrome.browserAction.setBadgeText({text:''});
		}
	})

}


//init
(function(){
	document.getElementById('startRecord').onclick = startRecord;
	document.getElementById('stopRecord').onclick = stopRecord;
})();
