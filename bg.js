var GithubRemark = function(initParams){
	var _started = false,
		_watchUrls = ['github.com'],
		_version = "0.1";
	
	Object.defineProperties(this, {
		'isStart': { set: function(value){ _started = value; _valueUpdateTime = Date.now();}, get : function(){ return _started; } }
	});
	
	var _insertFunc = function (tabId,changeInfo,tab){

		if(changeInfo.status == 'loading'){
			var urlPattern = new RegExp("("+_watchUrls.join('|')+")");
			if(urlPattern.test(tab.url)){
				chrome.tabs.executeScript(tabId,{file : "webapi.js"},function(){
					chrome.tabs.executeScript(tabId,{file : "ghremark.js"});
				});
			}
		}
	}

	this.start = function(){
		if(_started == true) return;
		
		chrome.tabs.onUpdated.addListener(_insertFunc);
		localStorage.recordStatus = "on";
		_started = true;
	};

	this.stop = function(){
		if(_started == false) return;
		chrome.tabs.onUpdated.removeListener(_insertFunc);
		localStorage.recordStatus = "off";
		_started = false;
	};
}


//init

var gr = new GithubRemark();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	switch(message.method){
		case 'start': 
			gr.start();
			sendResponse({status: gr.isStart});
			break;
		case 'stop': 
			gr.stop();
			sendResponse({status: gr.isStart});
			break;
		case 'getLocalStorage': 
			sendResponse(localStorage.getItem(message.key));
			break;
		case 'setLocalStorage': 
			localStorage.setItem(message.key, message.value);
			break;
	} 
});

//恢复上次的状态
if(localStorage.recordStatus == "on"){
	gr.start();
	chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
	chrome.browserAction.setBadgeText({text: 'on'});
}