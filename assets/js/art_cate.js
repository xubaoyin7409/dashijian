$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 同过代理的形式,为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败')
                }
                initArtCateList()
                layer.msg('添加文章分类成功');
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的形式为.btn-edit绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式,为修改分类表单 绑定 submit 事件监听事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败')
                }
                initArtCateList()
                layer.msg('修改文章分类成功');
                layer.close(indexEdit);
            }
        })
    })

    // 通过代理的形式,为删除按钮绑定删除事件
    $('body').on('click', '.btn-delete', function () {
        // console.log('ok');
        var id = $(this).attr('data-id');
        // console.log(id);

        // 提示用户是否要删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    initArtCateList()
                    layer.close(index);
                }
            })
        });
    })
})