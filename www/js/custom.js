//var MAIN_URL = 'http://digiroltest.com/hdfcdata/v1.0/',
var MAIN_URL = 'http://localhost/hdfcdata/',
    API_URL = MAIN_URL + 'Hdfcapi/',
    LOGIN_URL = API_URL + 'login',
    CURRENT_URL = window.location.href,
    $AJAX;

$ = jQuery.noConflict();
$(document).ready(function () {
    if (getPageName(CURRENT_URL) !== 'index') {
        setTimeout(notification, 1000);
    }

    $('#notify_link').click(function () {
        $('.main').load('notification.html')
    });
    $(".login-btn").on("click", function (e) {
        $this = $(this);
        var data = $(".login-data").serialize();

        //checking if serialize data is empty
        if (data.indexOf('=&') > -1 || data.substr(data.length - 1) === '=') {
            alert("Please enter your login information"); // convert this to toast message in cordova
            changeButtonTextValue($this, 'Login');
        }
        else {
            changeButtonTextValue($this, 'Logging in...');
            sendRequest(LOGIN_URL, data).done(function (response) {
                if (response.status === 0) {
                    changeButtonTextValue($this, 'Login');
                    alert(response.message);
                }
                if (response.status === 1) {
                    setStorageData('session_id', response.items.session_id);
                    redirect('inner.html');
                }
            }).error(function (Error, Exception) {
                changeButtonTextValue($this, 'Login');
                alert(Exception);
            });
        }
    });

    $(".logout-btn").on("click", function (e) {
        var session_id = getStorageData('session_id');
        sendRequest(API_URL + 'logout', {'session_log': session_id})
            .done(function (response) {
                if (response.status === 1) {
                    $('#message').val(response.message);
                    removeStorageData('session_id');
                    redirect('index.html');
                }
            })
            .error(function (error) {
                alert(error.responseText);
            });
    });

    $('#so_form').submit(function (e) {
        e.preventDefault();
        var $form = $(this),
            session_id = getStorageData('session_id');

        if (!$form.validate()) return false;

        var arr = $form.serializeArray();
        var formData = {};
        $.each(arr, function (i, each) {
            formData[each.name] = each.value;
        });
        formData['session_id'] = session_id;

        sendRequest(API_URL + 'set_contact', formData).done(function (response) {
            if (response.status === 0) {
                alert(response.message);
            }
            if (response.status === 1) {
                alert(response.message);
            }
            if (response.status === -1) {
                alert(response.message);
                removeStorageData('session_id');
                redirect('index.html');
            }
        }).error(function (error) {
            alert(error.reposnseText);
        });
    });
});


/*-------------Core Function-----------------*/
function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    return filenameWithExtension.split(".")[0];
}

function changeButtonTextValue($btn, value) {
    $btn.text(value);
}

function disableElement(element) {
    element.attr('disabled', true);
}
function enableElement(element) {
    element.removeAttr('disabled');
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
function redirect(url) {
    window.location.replace(url);
}


function checkSession(session_id) {
    sendRequest(API_URL + 'session_exist', {session_id: session_id}, 'html')
        .done(function (response) {
            if (response == 0) {
                removeStorageData('session_id');
                redirect('index.html');
            }

        })
        .error(function (error) {
            alert(error.responseText);
        });
}

/**
 *
 * @param urlToCall
 * @param data
 * @param datatype
 * @returns {*}
 */
var sendRequest = function (urlToCall, data, datatype) {

    return $.ajax({
        url     : urlToCall,
        type    : 'post',
        dataType: typeof (datatype) !== 'undefined' ? datatype : 'json',
        data    : typeof (data) !== 'undefined' ? data : ''
        /* beforeSend: function () {
         if (element) {
         changeButtonTextValue(element, btnTextBefore);
         element.attr('disabled', true);
         }
         },
         success   : function (response) {
         if (response.status === 0) {
         alert(response.message);
         if (typeof (element) !== 'undefined') {
         element.removeAttr('disabled');
         changeButtonTextValue(element, btnTextAfter);
         }
         }
         if (response.status === 1) {
         if (getPageName('login'))
         setStorageData('session_id', response.items.session_id);
         if (typeof (urlToRedirect) !== 'undefined') {
         redirect(urlToRedirect);
         }
         }
         }*/
    });
};


function enable(value) {
    if (value === 'Other') {
        $('#sub_associate_type').attr('required', true).parents('.col-md-4.col-sm-4').removeClass('hide');
    } else {
        $('#sub_associate_type').removeAttr('required', true).parents('.col-md-4.col-sm-4').addClass('hide');
    }
    if (value === 'Builder') {
        $('#builder_group').attr('required', true).parents('.col-md-4.col-sm-4').removeClass('hide');
    } else {
        $('#builder_group').removeAttr('required', true).parents('.col-md-4.col-sm-4').addClass('hide');
    }
    if (value === 'BSA') {
        $('input[name=\'developer_name\']').attr('placeholder', 'Company Name*');
    } else {
        $('input[name=\'developer_name\']').attr('placeholder', 'Developer Name*');
    }
}

var row = 1;
function addRow() {
    var $html = '<div class="row" id="row_' + row + '"><div class="add-account-form">';
    $html += '<div class="col-md-4 col-sm-4"><div class="form-group"><input type="text" class="form-control" placeholder="Name*" name="contacts[' + row + '][name]" required></div></div>';
    $html += '<div class="col-md-4 col-sm-4"><div class="form-group"><input type="text" class="form-control number" maxlength="10" placeholder="Contact No*" name="contacts[' + row + '][contact]" required></div></div>';
    $html += '<div class="col-md-4 col-sm-4"><div class="form-group"><input type="text" class="form-control birthdate" placeholder="Birth Date" data-field="date" name="contacts[' + row + '][dob]" readonly><div id="dtBox"></div>';
    $html += '<a href="javascript:void(0)" class="remove-input" onclick="$(\'#row_' + row + '\').remove();"><i class="icon ion-ios-minus"></i></a></div></div>';
    $html += '</div></div>';
    $('#add_row').append($html);
    row++;
}

function getStates() {
    sendRequest(API_URL + 'get_states').done(function (response) {
        var select = '<option value>-- Select State --</option>';
        $.each(response, function (value, text) {
            select += '<option value="' + text.state + '" data-id="' + text.id + '">' + text.state + '</option>';
        });
        $('#state').html(select);
    }).error(function (error) {
    });
}
function getCities() {
    var state_id = $('option:selected', '#state').attr('data-id');
    sendRequest(API_URL + 'get_cities', {state_id: state_id}, null, null, null, null, 'html').done(function (option) {
        $('#city').html(option);
    }).error(function (jqXhr, Exception) {
    });
}


function notification() {
    var session_id = getStorageData('session_id');
    sendRequest(API_URL + 'notification', {session_id: session_id})
        .done(function (response) {
            $('.notification-count').text(response.count);
        })
        .error(function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        });
}