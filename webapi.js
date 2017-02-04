var webApi = {
    _httpGet : function(url, callback){
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
	},
    _jsonPost : function(url, data, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if ( xhr.readyState === xhr.DONE ) {
				if ( xhr.status === 200 || xhr.status === 0 ) {
					callback( xhr.responseText );
				} else {
					console.error( "jsonPost err [" + url + "] [" + xhr.status + "]" );
				}
			}
		};
        xhr.setRequestHeader("Content-Type", "application/json");  
		xhr.open( "POST", url, true );
		xhr.send( data );
	}

};
webApi.updateRemark = function(userToken, username, remark, callback){
     _jsonPost('', {}, function(result){
        callback(result.success);
    })
};
webApi.getRemark = function(userToken, username, callback){
    _httpGet('', function(result){
        if(result.success)
            callback(result.data);
    })
};