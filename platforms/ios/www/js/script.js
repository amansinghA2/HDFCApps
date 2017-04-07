var MAIN_URL = 'http://digiroltest.com/hdfcdata/v1.0/';
var LOGIN_URL = MAIN_URL + 'Hdfcapi/login';
$ = jQuery.noConflict();
jQuery(document).ready(function ($) {

    $("#forgot-btn").click(function (e) {
        $(".forgot-password").stop().fadeIn(500);
    });

    $(".close-forgot").click(function (e) {
        $(".forgot-password").stop().fadeOut(100);
    });
                       
    $(".login-btn").on("click", function (e) {
        $this = $(this);
        var data = $(".login-data").serialize();
        if (!data) {
            alert("Please enter your login information"); // covert this to toast message in cordova
            changeButtonTextValue($this, 'Login');
            return false;
        }
        var ajxr = $.ajax({
            url       : LOGIN_URL,
            data      : data,
            type      : "post",
            dataType  : "json",
            beforeSend: function () {
                changeButtonTextValue($this, 'Logging in...');
                return;
            },
            success   : function (response) {
                if (response.status === 0) {
                    alert(response.message);
                    changeButtonTextValue($this, 'Login');
                } else if (response.status == 1) {
                    //code to redirect to dashboard page
                    setStorageData('session_id', response.items.session_id);
                    window.location.replace('inner.html');
                }
            },
            error     : function (jQhr) {
                alert(jQhr);
            }
        });
    });
    $(".logout-btn").on("click", function (e) {
        removeStorageData('session_id');
    })
});
function changeButtonTextValue($btn, value) {
    $btn.text(value);

}
function getStorageData(key) {
    var storage = window.localStorage;
    return storage.getItem(key);
}
function setStorageData(key, value) {
    var storage = window.localStorage;
    return storage.setItem(key, value);
}
function removeStorageData(key) {
    var storage = window.localStorage;
    return storage.removeItem(key);
}

//$(window).scroll(function(){
//                 if ($(window).scrollTop() >= 20) {
//                 $('.header').addClass('fixed-header');
//                 }
//                 else {
//                 $('.header').removeClass('fixed-header');
//                 }
//                 });





