/*ajax -- create by jack*/
var $server = {
	/**
	 * ajax
	 * @param api [urlַ]
	 * @param type ['get'/'post']
	 * @param params []
	 * @param callback []
	 */
	ajax: function (api, type, params, callback) {
		$.ajax({
			url: api,
			type: type || 'get',
			data: params,
			dataType: 'json',
			success: function (data) {
				callback && callback(data);
			}
		})
	},
    /**
	 * login filter -- anywhere needs login call this function
     * @param options
     */
	ajaxFilter: function (options){
	    $.ajax({
			url: options.url || location.pathname,
			type: options.type || 'get',
			data: options.params || {},
			dataType: options.dataType || 'json',
			beforeSend: function (){
				options.beforeSend && options.beforeSend();
			},
			success: function (data){
			    if(data.error == 400){
			    	location.href =  '/app/user/login.html?returnUrl=' + location.href;
				}else{
			    	options.success && options.success(data);
				}
			},
			error: function (){
			    options.error && options.error();
			}
		})
	}
};
