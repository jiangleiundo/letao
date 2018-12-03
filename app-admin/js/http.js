/*base ajax请求*/
var $http = {
    ajax: function (options) {
        $.ajax({
            url: options.url,
            type: options.type || 'get',
            data: options.data || {},
            dataType: options.dataType || 'json',
            beforeSend: function () {
                options.beforeSend && options.beforeSend()
            },
            success: function (data) {
                options.success && options.success(data)
            },
            error: function (err) {
                options.error && options.error(err)
            }
        })
    }
};