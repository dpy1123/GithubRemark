var GithubRemark = function (initParams) {
	var _started = false,
		_watchUrls = ['github.com'];

	Object.defineProperties(this, {
		'isStart': { set: function (value) { _started = value; _valueUpdateTime = Date.now(); }, get: function () { return _started; } }
	});

	var _insertFunc = function (tabId, changeInfo, tab) {
		if (changeInfo.status == 'complete') {
			var urlPattern = new RegExp("(" + _watchUrls.join('|') + ")");
			if (urlPattern.test(tab.url)) {
				chrome.scripting.executeScript({
					target: { tabId: tabId },
					files: ['webapi.js', 'ghremark.js']
				});
			}
		}
	}

	this.start = function () {
		if (_started == true) return;
		chrome.tabs.onUpdated.addListener(_insertFunc);
		chrome.storage.local.set({ recordStatus: "on" });
		_started = true;
	};

	this.stop = function () {
		if (_started == false) return;
		chrome.tabs.onUpdated.removeListener(_insertFunc);
		chrome.storage.local.set({ recordStatus: "off" });
		_started = false;
	};
}


//init

var gr = new GithubRemark();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	switch (message.method) {
		case 'start':
			gr.start();
			sendResponse({ status: gr.isStart });
			break;
		case 'stop':
			gr.stop();
			sendResponse({ status: gr.isStart });
			break;
		// case 'getLocalStorage': 
		// 	chrome.storage.local.get(message.key).then((result) => {
		// 		console.log("Value is set to " + result[message.key]);
		// 		sendResponse(result[message.key]);
		// 	});
		// 	break;
		// case 'setLocalStorage': 
		// 	chrome.storage.local.set({ [message.key] : message.value });
		// 	break;
	}

});

//恢复上次的状态
chrome.storage.local.get("recordStatus").then((result) => {
	if (result["recordStatus"] == "on") {
		gr.start();
		chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
		chrome.action.setBadgeText({ text: 'on' });
	}
});