$(function () {
    var $J_login_form = $('#J_login_form');
    $J_login_form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '用户名只能包含大写、小写、数字和下划线'
                    },
                    callback: { //ajax验证错误
                        message: '用户名错误'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '密码在6-18个字符内'
                    },
                    callback: {
                        message: '密码不正确'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault(); //禁用默认提交事件
        var $form = $(e.target); //需要提交的form
        var bv = $form.data('bootstrapValidator'); //获取校验组件

        $http.ajax({
            url: API_LOGIN_EMPLOYEE,
            type: 'post',
            data: $form.serialize(),
            success: function (data){
                if (data.success) {
                    location.href = '/app-admin/index.html'
                } else {
                    //bv.disableSubmitButtons(false); //登录失败回复可提交的按钮
                    /* 指定某一个表单元素的错误提示  NOT_VALIDATED, VALIDATING, INVALID or VALID */
                    if (data.error === 1000) { //用户名错
                        bv.updateStatus('username', 'INVALID', 'callback');
                    } else if (data.error === 1001) {//密码错
                        bv.updateStatus('password', 'INVALID', 'callback');
                    }
                }
            }
        })
    });

    //重置登录数据
    $('[type="reset"]').on('click', function (){
        $J_login_form.data('bootstrapValidator').resetForm();
    })
});