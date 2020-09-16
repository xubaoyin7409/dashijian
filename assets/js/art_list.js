$(function () {

    var layer = layui.layer;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var yy = dt.getFullYear();
        var mm = dt.getMonth() + 1;
        mm = mm < 10 ? '0' + mm : mm;
        var dd = dt.getDate();
        dd = dd < 10 ? '0' + dd : dd;

        var h = dt.getHours();
        h = h < 10 ? '0' + h : h;
        var m = dt.getMinutes();
        m = m < 10 ? '0' + m : m;
        var s = dt.getSeconds();
        s = s < 10 ? '0' + s : s;
        return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s
    }



    // 定义一个查询的参数对象,将来请求数据的时候,
    //需要将请求参数对象提交到服务器,
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示几条数据,默认显示两条
        cate_id: '', //文章分类的 id
        state: '' //文章的发布状态
    }


    initTable()
    initCate()

    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui 重新渲染表单区域的UI结构
                layui.form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件,重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用layPage的方法,来渲染分页的结构
        laypage.render({
            elem: pageBox, //分页的容器id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换到时候, 触发jump回调
            // 触发jump回调的方式有两种
            // 1. 点击页码的时候会触发 jump 回调
            // 2. 只要调用 laypage.render() 方法,就会触发jump回调
            jump: function (obj, first) {
                // 可以通过first的值来判断是通过哪种方式,出发的jump回调
                // 如果first的值为true,证明是方式二出发的,
                // 否则是方式一触发的
                console.log(first);

                // console.log(obj.curr);

                // 把最新的页码值 重新赋值给 q 这个查询参数对象中
                q.pagenum = obj.curr;

                // 把最新的条目数,赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的列表 并渲染表格
                if (!first) {
                    initTable();
                }
            }
        })

    }

    // 通过代理的形式,为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // console.log(len);
        // console.log('ok');
        // 询问用户是否要删除数据
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    // 当数据删除完成后,需要判断当前这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据了, 这让页码值 - 1 之后,
                    // 再重新调用 initTable() 方法
                    if (len === 1) {
                        // 如果len的值也能等于 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})