var CouponRecorder = function(initParams){
	var _isRecord = false,
		_watchUrls = ['github.com'],
		// _logUrl = 'http://promotion.devgo.top/coupon_recorder/v1/view_log/log',
		_version = "0.1";
	
	Object.defineProperties(this, {
		'isRecord': { set: function(value){ _isRecord = value; _valueUpdateTime = Date.now();}, get : function(){ return _isRecord; } }
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
				chrome.tabs.executeScript(tabId,{file : "bower_components/jquery/dist/jquery.js"},function(){
					chrome.tabs.executeScript(tabId,{file : "smzdm.js"});
				});
			}
		}
	}

	this.start = function(){
		if(_isRecord == true) return;//防止重复启动

		//注册事件的响应函数
		chrome.tabs.onUpdated.addListener(_insertFunc);
		localStorage.recordStatus = "on";
		_isRecord = true;
	};

	this.stop = function(){
		if(_isRecord == false) return;
		chrome.tabs.onUpdated.removeListener(_insertFunc);
		localStorage.recordStatus = "off";
		_isRecord = false;
	};


	var _httpGet = function(url, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if ( xhr.readyState === xhr.DONE ) {
				if ( xhr.status === 200 || xhr.status === 0 ) {
					if ( xhr.responseText ) {
						callback( xhr.responseText );
					} else {
						console.warn( "[" + url + "] seems to be unreachable or file there is empty" );
					}
				} else {
					console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );
				}
			}
		};
		xhr.open( "GET", url, true );
		xhr.send( null );
	}

	// this.log = function(params, callback){		
	// 	var url = _logUrl+"?user="+params.userId+"&article_id="+params.itemId+"&action="+params.action+"&site="+params.site;
	// 	_httpGet(url, function(data){
	// 		callback(JSON.parse(data));
	// 	});
	// };

}


//init

var cr = new CouponRecorder();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	switch(message.method){
		case 'start': 
			cr.start();
			sendResponse({status: cr.isRecord});
			break;
		case 'stop': 
			cr.stop();
			sendResponse({status: cr.isRecord});
			break;
		case 'log': 
			cr.log(message.params, function(result){
				console.log(result);
				sendResponse({"status": (result=="success")});
			})
			return true;//chrome.runtime.onMessage.addListener:This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until sendResponse is called).
			//So just add "return true;" to indicate that you'll call the response function asynchronously.
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
	cr.start();
	chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
	chrome.browserAction.setBadgeText({text: 'on'});
}