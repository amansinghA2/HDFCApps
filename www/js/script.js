$(document).ready(function () {

    //call jPushMenu, required//
    $('.toggle-menu').jPushMenu();

    $("#forgot-btn").click(function () {
        $(".forgot-password").fadeIn(500);
    });

    $(".close-forgot").click(function () {
        $(".forgot-password").fadeOut(100);
    });

    $('.number').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190])
        || /65|67|86|88/.test(e.keyCode)
        && (!0 === e.ctrlKey || !0 === e.metaKey)
        || 35 <= e.keyCode && 40 >= e.keyCode
        || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode)
        && (96 > e.keyCode || 105 < e.keyCode)
        && e.preventDefault()
    });

    var dropdownSelectors = $('.dropdown, .dropup');

// Custom function to read dropdown data
// =========================
    function dropdownEffectData(target) {
        // @todo - page level global?
        var effectInDefault = null,
            effectOutDefault = null;
        var dropdown = $(target),
            dropdownMenu = $('.dropdown-menu', target);
        var parentUl = dropdown.parents('ul.nav');

        // If parent is ul.nav allow global effect settings
        if (parentUl.size() > 0) {
            effectInDefault = parentUl.data('dropdown-in') || null;
            effectOutDefault = parentUl.data('dropdown-out') || null;
        }

        return {
            target      : target,
            dropdown    : dropdown,
            dropdownMenu: dropdownMenu,
            effectIn    : dropdownMenu.data('dropdown-in') || effectInDefault,
            effectOut   : dropdownMenu.data('dropdown-out') || effectOutDefault,
        };
    }

// Custom function to start effect (in or out)
// =========================
    function dropdownEffectStart(data, effectToStart) {
        if (effectToStart) {
            data.dropdown.addClass('dropdown-animating');
            data.dropdownMenu.addClass('animated');
            data.dropdownMenu.addClass(effectToStart);
        }
    }

// Custom function to read when animation is over
// =========================
    function dropdownEffectEnd(data, callbackFunc) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        data.dropdown.one(animationEnd, function () {
            data.dropdown.removeClass('dropdown-animating');
            data.dropdownMenu.removeClass('animated');
            data.dropdownMenu.removeClass(data.effectIn);
            data.dropdownMenu.removeClass(data.effectOut);

            // Custom callback option, used to remove open class in out effect
            if (typeof callbackFunc == 'function') {
                callbackFunc();
            }
        });
    }

// Bootstrap API hooks
// =========================
    dropdownSelectors.on({
        "show.bs.dropdown" : function () {
            // On show, start in effect
            var dropdown = dropdownEffectData(this);
            dropdownEffectStart(dropdown, dropdown.effectIn);
        },
        "shown.bs.dropdown": function () {
            // On shown, remove in effect once complete
            var dropdown = dropdownEffectData(this);
            if (dropdown.effectIn && dropdown.effectOut) {
                dropdownEffectEnd(dropdown, function () {
                });
            }
        },
        "hide.bs.dropdown" : function (e) {
            // On hide, start out effect
            var dropdown = dropdownEffectData(this);
            if (dropdown.effectOut) {
                e.preventDefault();
                dropdownEffectStart(dropdown, dropdown.effectOut);
                dropdownEffectEnd(dropdown, function () {
                    dropdown.dropdown.removeClass('open');
                });
            }
        }
    });
});