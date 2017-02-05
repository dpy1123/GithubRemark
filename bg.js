var GithubRemark = function(initParams){
	var _started = false,
		_watchUrls = ['github.com'],
		_version = "0.1";
	
	Object.defineProperties(this, {
		'isStart': { set: function(value){ _started = value; _valueUpdateTime = Date.now();}, get : function(){ return _started; } }
	});
	
	var _insertFunc = function (tabId,changeInfo,tab){

		if(changeInfo.status == 'loading'){//刷新一次标签页，onUpdated会被触发两次，第一次changeInfo.status是loading，第二次是changeInfo.status是complete
			
			var urlPattern = new RegExp("("+_watchUrls.join('|')+")");
			if(urlPattern.test(tab.url)){
				//让用户界面执行代码。
				//chrome.tabs.executeScript(tabId,{code : "alert('看看这是那个页面弹出的！');"});
				//让用户界面执行一个文件的JS。
				//chrome.tabs.executeScript(integer tabId, object details, function callback) 
				//可惜的是file只支持单个js文件，如果我们有多个js文件，会带来不便，难不成要合并成一个js？答案是：使用callback参数，在第一个js执行完成，回调时，注入下一个js文件。
				chrome.tabs.executeScript(tabId,{file : "webapi.js"},function(){
					chrome.tabs.executeScript(tabId,{file : "ghremark.js"});
				});
			}
		}
	}

	this.start = function(){
		if(_started == true) return;//防止重复启动

		//注册事件的响应函数
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