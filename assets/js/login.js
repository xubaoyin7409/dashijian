$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide()
    })
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        psw: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repsw: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var psw = $('.reg-box [name=password]').val()
            if (psw !== value) {
                return '两次密码不一致！'
            }
        }
    })
    //监听表单的注册提交事件
    
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录!');
            $('#link_login').click();
        })
    })
    // 监听表单的登录提交事件
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA5NTYsInVzZXJuYW1lIjoieHViYW95aW4iLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiIiwiZW1haWwiOiIiLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU5OTg4OTU4NSwiZXhwIjoxNTk5OTI1NTg1fQ.mCs_fzMtQ3sf5lRwkyoB1eVBVefTM9eMlBv05xT4uWM
    $('#form-login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败');
                }
                layer.msg('登录成功')
                // console.log(res.token);

                // 将登陆成功后的token字符串保存到localstorage 中
                localStorage.setItem('token',res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            
            }
        })
    })
})