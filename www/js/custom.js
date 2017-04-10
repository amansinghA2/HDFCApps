var MAIN_URL = 'http://digiroltest.com/hdfcdata/v1.0/',
    API_URL = MAIN_URL + 'Hdfcapi/',
    LOGIN_URL = API_URL + 'login',
    CURRENT_URL = window.location.href,
    $AJAX;

$ = jQuery.noConflict();
$(document).ready(function () {
    var currentPage = getPageName(CURRENT_URL);
    if (currentPage === 'inner') {
        getStates();
    }
    if ((currentPage === '' || currentPage === 'index') && getStorageData('session_id') !== null) {
        redirect('inner.html');
    }

    if (currentPage === 'inner' && !getStorageData('session_id')) {
        redirect('index.html');
    }


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
        removeStorageData('session_id');
        redirect('index.html');
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

/**
 *
 * @param urlToCall             Ajax call url
 * @param urlToRedirect         Redirect Url after success
 * @param data
 * @param element
 * @param btnTextBefore
 * @param btnTextAfter
 * @param datatype
 * @returns {boolean}
 */
var sendRequest = function (urlToCall, data, element, btnTextBefore, btnTextAfter, urlToRedirect, datatype) {

    return $.ajax({
        url     : urlToCall,
        type    : 'post',
        dataType: typeof (datatype) !== 'undefined' ? datatype : 'json',
        data    : typeof (data) !== 'undefined' ? data : '',
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

function saveFormData(element) {
    var formData = $('#so_form').serialize();
    changeButtonTextValue(element, 'Submitting...');
    sendRequest(API_URL + 'set_contact', {data: formData}).done(function (response) {
        if (response.status === 0) {
            alert(response.message);
        }
        if (response.status === 1) {
            alert(response.message);
            redirect('')
        }
        if (response.status === -1) {
            alert(response.message);
            removeStorageData('session_id');
            redirect('index.html');
        }
        changeButtonTextValue(element, 'Save & Close');
    }).error(function (error) {
        alert(error.reposnseText);
        changeButtonTextValue(element, 'Save & Close');
    });
}
var row = 1;
function addRow() {
    var $html = '<div class="row" id="row_' + row + '"><div class="add-account-form">';
    $html += '<div class="col-md-4 col-sm-4"><div class="form-group"><input type="text" class="form-control" placeholder="Name*" name="contacts[' + row + '][name]" required></div></div>';
    $html += '<div class="col-md-4 col-sm-4"><div class="form-group"><input type="text" class="form-control" placeholder="Contact No*" name="contacts[' + row + '][contact]" required></div></div>';
    $html += '<div class="col-md-4 col-sm-4"><div class="form-group"><input type="text" class="form-control birthdate" placeholder="Birth Date" data-field="date" name="contacts[' + row + '][dob]" readonly><div id="dtBox"></div>';
    $html += '<a href="javascript:void(0)" class="remove-input" onclick="$(\'#row_' + row + '\').remove();"><i class="icon ion-ios-minus"></i></a></div></div>';
    $html += '</div></div>';
    $('#add_row').append($html);
    row++;
}

function getStates() {
    sendRequest(API_URL + 'get_states').done(function (response) {
        var select = '';
        $.each(response, function (value, text) {
            select += '<option value="' + text.id + '">' + text.state + '</option>';
        });
        $('#state').html(select);
    }).error(function (error) {
    });
}
function getCities() {
    var state = $('#state').val();
    sendRequest(API_URL + 'get_cities', {state_id: state}, null, null, null, null, 'html').done(function (option) {
        $('#city').html(option);
    }).error(function (jqXhr, Exception) {
    });

}