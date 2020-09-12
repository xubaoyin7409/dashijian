// 注意:每次调 $.get() 或 $.post() 或 $.ajax()
// 会先调用 ajaxPrefilter这个函数.
// 在这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // 在真正发起ajax请求之前,统一拼接请求的根路径
    options.url='http://ajax.frontend.itheima.net'+ options.url;
})