

function checkUserId(userId) {
	if (userId == null) {
		var newId = window.prompt("请输入用户名", "userId");
		if (newId == null || newId == "userId") {
			alert('请先右键本扩展，在选项中设置userId！');
		} else {
			setLocalStorage('userId', newId);
			alert('新userId已设置，请刷新此页面！');
		}
	}
	return !(userId == null);
}

function getLocalStorage(key, callback) {
	chrome.runtime.sendMessage({ "method": "getLocalStorage", "key": key }, function (response) { callback(response); })
}

function setLocalStorage(key, value) {
	chrome.runtime.sendMessage({ "method": "setLocalStorage", "key": key, "value": value })
}

function updateRemark(userToken, username, remark){
	webApi.updateRemark(userToken, username, remark, function(success){
		if(success)
			showRemarks(userToken);
		else
			alert('更新失败！');
	});
}

function getRemark(userToken, username, callback) {
	webApi.getRemark(userToken, username, callback);
}

// document.addEventListener('readystatechange', function () {
// 	if (document.readyState == "complete") { //当页面加载状态为完全结束时进入 
console.log('inject');
getLocalStorage('userId', function (value) {
	if (checkUserId(value)) {
		showRemarks(value);
	}
})
// 	}
// });




function getMasterOfPage() {
	var master = /github.com\/([^\/|^\?]+)/.exec(location.href);
	if (master !== null)
		master = master[1];
	return master;
}

function getCurrentTab() {
	var tab = /[\?|\&]tab=([^\&]+)/.exec(location.href);
	if (tab !== null)
		tab = tab[1];
	return tab;
}

function insertAfter(newEl, targetEl) {
	var parentEl = targetEl.parentNode;
	if (parentEl.lastChild == targetEl) {
		parentEl.appendChild(newEl);
	} else {
		parentEl.insertBefore(newEl, targetEl.nextSibling);
	}
}

function buildSpanElement(cssName, textContent) {
	var span = document.createElement('span');
	span.className = cssName;
	span.textContent = textContent;
	return span;
}

function showRemarkInLeftPannel(userToken) {
	var vcard = document.querySelector('h1.vcard-names');//author in home page
	if (!!vcard) {
		if (vcard.childElementCount > 2)
			vcard.removeChild(vcard.querySelector('span.github-remarks'));

		var username = getMasterOfPage();
		getRemark(userToken, username, function(remark){
			var remarkEl = buildSpanElement('vcard-username d-block github-remarks', '(' + remark + ')');
			remarkEl.addEventListener('dblclick', function (event) {
				changeRemarks(userToken, username, remark);
			}, false);
			vcard.appendChild(remarkEl);
		});
	}
}

function showRemarkInStarsTab(userToken) {
	var stars = document.querySelectorAll('div.d-inline-block.mb-1 > h3 > a');//in star page
	if (stars !== null) {
		stars.forEach(function (element) {
			var div = element.parentNode;
			if (!!div.querySelector('span.github-remarks'))
				div.removeChild(div.querySelector('span.github-remarks'));

			if(!!element.querySelector('span.text-normal')){
				var text = element.querySelector('span.text-normal').textContent;
				var username = text.substring(0, text.indexOf(' /'));
				getRemark(userToken, username, function(starRemark){
					var remarkEl = buildSpanElement('link-gray pl-1 github-remarks', '(' + starRemark + ')');
					remarkEl.addEventListener('dblclick', function (event) {
						changeRemarks(userToken, username, starRemark);
					}, false);
					insertAfter(remarkEl, element);
				});
			}
		}, this);
	}
}

function showRemarkInFollowersTab(userToken) {
	var followers = document.querySelectorAll('div.d-table-cell.col-9.v-align-top.pr-3 > a');//in followers/following page
	if (!!followers) {
		followers.forEach(function (element) {
			var div = element.parentNode;
			if (!!div.querySelector('span.github-remarks'))
				div.removeChild(div.querySelector('span.github-remarks'));
			
			var username = element.querySelector('span.link-gray.pl-1').textContent;
			getRemark(userToken, username, function(followerRemark){
				var remarkEl = buildSpanElement('link-gray pl-1 github-remarks', '(' + followerRemark + ')');
				remarkEl.addEventListener('dblclick', function (event) {
					changeRemarks(userToken, username, followerRemark);
				}, false);
				insertAfter(remarkEl, element);
			});
		}, this);
	}
}

function showRemarkInRepoDetailPage(userToken) {
	var author = document.querySelector('span.author > a');//in a repo page
	if (!!author) {
		var username = getMasterOfPage();
		getRemark(userToken, username, function(remark){
			author.textContent = username + '(' + remark + ')';
		});
	}
}

function showRemarks(userToken) {
	showRemarkInLeftPannel(userToken);
	var tab = getCurrentTab();
	switch (tab) {
		case 'repositories':
			break;
		case 'stars':
			showRemarkInStarsTab(userToken);
			break;
		case 'following':
		case 'followers':
			showRemarkInFollowersTab(userToken);
			break;
		default:
			showRemarkInRepoDetailPage(userToken);
			break;
	}
}

function changeRemarks(userToken, username, oldValue) {
	var newValue = window.prompt("请输入新备注", oldValue);
	if (newValue !== null && newValue !== oldValue) {
		updateRemark(userToken, username, newValue);
	}
}
