var webApi = {
	_server_host : 'https://promotion.devgo.top/github_remark',
    _httpGet : function(url, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if ( xhr.readyState === xhr.DONE ) {
				if ( xhr.status === 200 || xhr.status === 0 ) {
					if ( xhr.response ) {
						callback( xhr.response );
					} else {
						console.warn( "[" + url + "] seems to be unreachable or file there is empty" );
					}
				} else {
					console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );
				}
			}
		};
		xhr.open( "GET", url, true );
		xhr.responseType = "json"; 
		xhr.send( null );
	},
    _jsonPost : function(url, data, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if ( xhr.readyState === xhr.DONE ) {
				if ( xhr.status === 200 || xhr.status === 0 ) {
					callback( xhr.response );
				} else {
					console.error( "jsonPost err [" + url + "] [" + xhr.status + "]" );
				}
			}
		};
		xhr.open( "POST", url, true );
        xhr.setRequestHeader("Content-Type", "application/json"); 
		xhr.responseType = "json"; 
		xhr.send( JSON.stringify(data) );
	}

};
webApi.updateRemark = function(userToken, username, remark, callback){
	var data = {'token':userToken, 'username':username, 'remark':remark};
    this._jsonPost(this._server_host+'/updateRemark', data, function(result){
        callback(result.success);
    })
};
webApi.getRemark = function(userToken, username, callback){
	var url = this._server_host+'/getRemark?token='+userToken+'&username='+username;
    this._httpGet(url, function(result){
		if(result.success)
        	callback(result.data);
    })
};