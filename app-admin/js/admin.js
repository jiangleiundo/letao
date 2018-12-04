/*ajax请求开始打开进度条, 结束时关闭*/
$(window).ajaxStart(function () {
    NProgress.start();
}).ajaxStop(function () {
    NProgress.done();
});

/*侧边动画*/
$('[data-menu]').on('click', function (){
    $('.ad-aside').toggle();
    $('.ad-section').toggleClass('menu');
});
/*二级菜单*/
$('.menu [data-sec]').on('click', function (){
    $(this).siblings('.child').slideToggle();
});

$('[data-logout]').on('click', function (){
    modal.create();
    $('.modal-logout').off('click', '.btn-primary').on('click', '.btn-primary', function (){
        $http.ajax({
            url: API_LOGOUT_EMPLOYEE,
            success: function (data){
                if(data.success){
                    modal.close();
                    location.href = URL_LOGIN;
                }
            }
        })
    })
});
var modal = {
    create: function (){
        var html =
            '<div class="modal fade modal-logout">'+
            '    <div class="modal-dialog modal-sm">'+
            '        <div class="modal-content">'+
            '            <div class="modal-header">'+
            '                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>'+
            '                <h4 class="modal-title">提示</h4>'+
            '            </div>'+
            '            <div class="modal-body">'+
            '                <p><span class="glyphicon glyphicon-info-sign alert-danger"></span> 你确定要退出后台管理系统吗？</p>'+
            '            </div>'+
            '            <div class="modal-footer">'+
            '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
            '                <button type="button" class="btn btn-primary">确定</button>'+
            '            </div>'+
            '        </div>'+
            '    </div>'+
            '</div>';
        var isHas = $('body').find('.modal-logout').length;
        if(!isHas){//如果页面已经有modal就不在添加
            $('body').append(html);
        }
        $('.modal-logout').modal('show');
    },
    close: function (){
        $('.modal-logout').modal('hide');
    }
};