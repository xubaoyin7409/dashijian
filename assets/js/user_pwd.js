$(function () {
    var form = layui.form;
    // var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samepwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        repwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不相同'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res.status);
                if (res.status !== 0) {
                    return layui.layer.msg('密码修改失败')
                }
                layui.layer.msg('密码修改成功')
                // 重置表单
                $('.layui-form')[0].reset()
                // console.log('ok')
            }
        })

    })
})
//===========================================
// $(function () {
//     var form = layui.form;
//     form.verify({
//         // 验证密码格式必须6到12位
//         pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
//         // 验证新旧密码不能相同
//         samepwd: function (value) {
//             if(value===$('[name=oldPwd]').val()) return layui.layer.msg('新旧密码不能一致')
//         },
//         // 验证确认密码和新密码相同
//         repwd: function (value) {
//             if(value!==$('[name=newPwd]').val()) return layui.layer.msg('两次密码不一致')
//         }
//     })
//     $('.layui-form').on('submit', function (e) {
//         e.preventDefault();

//     })
// })