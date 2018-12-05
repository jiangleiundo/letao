$(function () {

    //模板请求内部无法访问外部变量解决方法
    template.helper('get_jQuery', function () {
        return jQuery;
    });
    var render = function (page) {
        var curPage = page || 1;
        getCategory2(curPage, function (data) {
            //渲染模板
            $('#table_body').html(template('tableTpl', data));
            //初始化分页组件
            setPaginator(data);
        })
    };
    render();

    //分页功能
    var setPaginator = function (data) {
        $('.pagination').bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应bootstrap版本
            size: 'small', //分页大小
            currentPage: data.page, //当前页
            numberOfPages: 3, //显示的页数
            totalPages: Math.ceil(data.total / data.size), // 总页数
            /**
             * 分页点击事件
             * @param event [jquery对象]
             * @param originalEvent [dom原生对象]
             * @param type [按钮类型]
             * @param page [点击按钮对应的页码]
             */
            onPageClicked: function (event, originalEvent, type, page) {
                render(page);//根据点击页数渲染页面
            }
        })
    };

    //点击提交添加二级分类
    $('#add_category').on('click', function (){
        var $form = $('#form_category2');
        $form.data("bootstrapValidator").resetForm();
        $form.find('input').val('');
        $form.find('.category-sel').html('请选择一级分类');
        $form.find('img').attr('src','/app-admin/images/none.png');
        $('#modal_add_category2').modal('show');
    });

    //校验添加二级分类表单
    var $form_category2 = $('#form_category2');
    $form_category2.bootstrapValidator({
        //指定不验证的情况excluded: [':disabled', ':hidden', ':not(:visible)'],
        excluded: [':disabled'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传品牌logo'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault(); //禁用默认提交事件
        var $form = $(e.target); //需要提交的form
        //var bv = $form.data('bootstrapValidator'); //获取校验组件
        $http.ajax({
            url: API_ADD_SEC_CATEGORY,
            type: 'post',
            data: $form.serialize(),
            success: function (data){
                if(data.success){
                    $('#modal_add_category2').modal('hide'); //隐藏模态框
                    render();
                }
            }
        })
    });

    //获取一级分类
    getCategory(function (data) {
        var $dropMenu = $('.dropdown-menu');
        $dropMenu.html(template('categoryTpl', data)); //渲染一级分类数据

        $dropMenu.on('click', 'a', function () {
            var categoryName = $(this).html();
            $('.category-sel').html(categoryName); //选择一级分类
            var categoryId = $(this).attr('data-id');
            $('[name="categoryId"]').val(categoryId); //将需要提交的信息放到隐藏的input中
            $('#form_category2').data('bootstrapValidator').updateStatus('categoryId', 'VALID', null); //显示合法提示
        })
    });

    //初始化上传
    initFileUpload();
});

//获取1级分类
var getCategory = function (callback) {
    var params = {
        page: 1,
        pageSize: 100
    };
    $http.ajax({
        url: API_GET_CATEGORY_FIR,
        data: params,
        success: function (data) {
            callback && callback(data)
        }
    })
};

//获取2级分类
var getCategory2 = function (curPage, callback) {
    var params = {
        page: curPage,
        pageSize: 2
    };
    $http.ajax({
        url: API_GET_CATEGORY_SEC,
        data: params,
        success: function (data) {
            callback && callback(data)
        }
    })
};

//初始化上传插件
var initFileUpload = function () {
    $('[name="pic1"]').fileupload({
        url: API_ADD_SEC_CATEGORY_PIC,
        dataType: 'json',
        done: function (e, data) {
            var source = data.result.picAddr;
            $('#upload_img_preview').attr('src', source);
            $('[name="brandLogo"]').val(source);
            $('#form_category2').data('bootstrapValidator').updateStatus('brandLogo', 'VALID', null); //显示合法提示
        }
    });
};