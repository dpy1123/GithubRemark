
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

function getGithubLoginUsername() {
	var doc = document.querySelector('strong.css-truncate-target');
	return doc==null?null:doc.textContent;
}

function hasLoginFrame() {
	var loginBtn = document.querySelector('a.btn.site-header-actions-btn');
	return loginBtn != null;
}


(function(){
	console.log('inject');
	var username = getGithubLoginUsername();
	if (username !== null) {
		showRemarks(username);
	}else if(hasLoginFrame()) {
		alert('你还未登陆github，请先登录你的github账户！');
	}
}());


function getMasterOfPage(url) {
	var master = /github.com\/([^\/|^\?]+)/.exec(url);
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

		var username = getMasterOfPage(location.href);
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

function showRemarkInRepoStargazersPage(userToken){
	var stargazers = document.querySelectorAll('div.follower-list-align-top > h3 > span');
	if (!!stargazers) {
		stargazers.forEach(function(element){
			var div = element.parentNode;
			if (!!div.querySelector('span.github-remarks'))
				div.removeChild(div.querySelector('span.github-remarks'));

			var username = getMasterOfPage(element.querySelector('a').href);
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
		var username = getMasterOfPage(location.href);
		getRemark(userToken, username, function(remark){
			author.textContent = username + '(' + remark + ')';
		});
	}
	var repoDetail = /\/(stargazers|watchers)$/.exec(location.href);
	if (repoDetail !== null) {
		switch (repoDetail[1]) {
			case 'watchers':
			case 'stargazers':
				showRemarkInRepoStargazersPage(userToken);
				break;
		}
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
