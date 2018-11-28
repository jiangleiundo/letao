$(function (){
    $('.lt-login').on('tap', '.mui-btn-primary', function (){
        if(window.isLogin){
            return false;
        }
        var params = {
            username: $('.mui-input-clear').val(),
            password: $('.mui-input-password').val()
        };
        if(_utility.isEmpty(params.username)){
            _dialog.toast('请输入用户名');
            return false;
        }
        if(_utility.isEmpty(params.password)){
            _dialog.toast('请输入密码');
            return false;
        }
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: params,
            dataType: 'json',
            beforeSend: function (){
                window.isLogin = 1;
            },
            success: function (data){
                if(data.success){
                    if(location.search && location.search.indexOf('?returnUrl=') > -1){ //存在returnUrl登录成功后就跳回去
                        location.href = _utility.getQueryString('returnUrl');
                    }else{
                        location.href = URL_USER_INDEX; //没有returnUrl就跳回个人中心
                    }
                }else{
                    _dialog.toast(data.message);
                }
                window.isLogin = 0;
            },
            error: function (){
                window.isLogin = 0;
            }
        })
    })
});