$(function (){
    getUserInfo(function (data){
        $('.lt-user-name').html(data.username);
        $('.lt-user-phone').html(data.mobile);
    });

    //logout
    $('.lt-logout').on('tap', '.mui-btn-danger', function (){
        $server.ajax(API_USER_LOGOUT, 'get', {}, function (data){
            if(data.success){
                location.href = URL_USER_LOGIN; //登出成功跳登录页
            }else{
                data.error && _dialog.toast(data.message);
            }
        })
    })
});
/*get user info*/
var getUserInfo = function (callback){
  $server.ajaxFilter({
      url: API_USER_INFO,
      type: 'get',
      data: {},
      dataType: 'json',
      success: function (data){
          callback && callback(data);
      }
  })
};