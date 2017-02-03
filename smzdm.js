

function sendUserAction(userId, itemId, action, site){
	//var userId = userId || localStorage.userId;//这里的localStorage是在content_script注入页的域下的，bg和option页中的localStorage是在chrome扩展下的，无法跨域访问
	if(userId == null){
		var newId = window.prompt("请输入用户名", "userId");
		if(newId == null || newId == "userId"){
			alert('请右键本扩展，在选项中设置userId！');
			return;
		}else{
			//localStorage.userId = newId;
			setLocalStorage('userId', newId);
		}
	}
	//alert(action+': [userId: '+userId+', itemId: '+itemId+']');
	chrome.runtime.sendMessage({"method": "log", "params": {"userId" : userId, "itemId": itemId, "action": action, "site": site}}, function(response){
			console.log(response);
		}
	)
}

function getLocalStorage(key, callback){
	chrome.runtime.sendMessage({"method": "getLocalStorage", "key": key}, function(response){
			callback(response);
		}
	)
}

function setLocalStorage(key, value){
	chrome.runtime.sendMessage({"method": "setLocalStorage", "key": key, "value": value})
}


//document.addEventListener('readystatechange', function(){
	//if(document.readyState == "complete"){ //当页面加载状态为完全结束时进入 
		console.log('inject');
showRemarks('bob');
	//} 
//});

function buildSpanElement(cssName, textContent){
	var span = document.createElement('span');
	span.className = cssName;
	span.textContent = textContent;
	return span;
}

function showRemarks(remarks){
	var author = document.querySelector('span.author > a');//author in repos page
	if(!!author){
		author.textContent += '('+remarks+')';
	}	

	var vcard = document.querySelector('h1.vcard-names');//author in home page
	if(!!vcard){
		if(vcard.childElementCount > 2)
			vcard.removeChild(document.querySelector('span.github-remarks'));
		var remarksEle = buildSpanElement('vcard-username d-block github-remarks', '('+remarks+')');
		remarksEle.addEventListener('dblclick', function(event){
			changeRemarks(remarks);
		}, false);
		vcard.appendChild(remarksEle);
	}

	var stars = document.querySelectorAll('span.text-normal');//users in star page
	if(!!stars){
		stars.forEach(function(element) {
			var text = element.textContent;
			//Todo: call get 
			var starRemark = 'ppp';
			element.textContent = text.substring(0, text.indexOf(' /')) + '('+starRemark+') /';
		}, this);
	}

	var followers = document.querySelectorAll('div.d-table-cell.col-9.v-align-top.pr-3 > a');//users in followers page
	if(!!followers){
		followers.forEach(function(element) {
			var div = element.parentNode;
			if(element.childElementCount > 2)
				div.removeChild(div.querySelector('span.github-remarks'));
			//Todo: call get 
			var followerRemark = 'ppp';
			var remarksEle = buildSpanElement('github-remarks', '('+followerRemark+')');
			remarksEle.addEventListener('dblclick', function(event){
				changeRemarks(followerRemark);
			}, false);
			element.FirstElement.append(remarksEle);	
		}, this);
	}
}

function changeRemarks(oldValue){
	var newValue = window.prompt("请输入新备注", oldValue);
	if(newValue !== null && newValue !== oldValue){
		//Todo: call update
		showRemarks(newValue);
	}
}
