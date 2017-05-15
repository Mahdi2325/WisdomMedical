/**
 * Created by Rocky on 2016/8/5.
 */
$(document).ready(function() {
    //从cookie获取用户 密码
    var nameInput = $("#nameWrapper input");
    var passwordInput = $("#passwordWrapper input")
    if($.cookie('username') != null &&  $.cookie('username')!= ""){
        nameInput.val($.cookie('username'));
    }
    else{
        nameInput.val("");
    }

    if($.cookie('password') != null &&  $.cookie('password')!= ""){
        passwordInput.val($.cookie('password'));
    }
    else{
        passwordInput.val("");
    }

    //bootstrap表单验证
    $('#loginForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            userName: {
                container: '#userNameMessage',
                validators: {
                    notEmpty: {
                        message: '请输入用户名'
                    }
                }
            },
            passWord: {
                container: '#passWordMessage',
                validators: {
                    notEmpty: {
                        message: '请输入密码'
                    }
                }
            }
        }
    }).on('error.form.bv', function(e) {
        // e.preventDefault();
    }).on('success.form.bv', function(e) {
        if($("#check-remember").prop("checked") == true){
            $.cookie('username', nameInput.val());
            $.cookie('password', passwordInput.val());
        }
        else{
            $.cookie('username', null);
            $.cookie('password',null);
        }

        // If you want to prevent the default handler (bootstrapValidator._onSuccess(e))
        e.preventDefault();
    })
});