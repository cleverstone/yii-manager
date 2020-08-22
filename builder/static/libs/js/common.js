/**
 * this is a background js-file for Yii-Manager
 */
(function (global, jQuery, factory) {
    "use strict"

    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(global, jQuery);
    } else if (typeof define === "function" && define.amd) {
        define('Ym', [], factory(global, jQuery));
    } else {
        global.Ym = factory(global, jQuery);
    }
}(typeof window === void 0 ? this : window, (function (jQuery) {
    return typeof jQuery === void 0 ? require('jquery') : jQuery;
}(window ? window.jQuery : void 0)), function (global, jQuery) {
    // Yii-manager global object
    var Ym;
    /**
     * Ym constructor
     * @constructor
     */
    var YmConstructor = function () {

    };

    /**
     * Sidebar toggles scripts
     */
    YmConstructor.prototype.toggleSideBar = function () {
        jQuery(document).on('click', '[data-toggle="sidebar"]', function (e) {
            var targetElement = jQuery(this).data('target'),
                jQueryElement = jQuery(targetElement);
            if (jQueryElement.hasClass('ym-show')) {
                jQueryElement.removeClass('ym-show');
            } else {
                jQueryElement.addClass('ym-show');
            }

        });
    };

    /**
     * Init all plugins
     */
    YmConstructor.prototype.initAllPlugins = function () {
        /* Sets select2 bootstrap3-theme */
        jQuery.fn.select2.defaults.set("theme", "bootstrap");
        /* Initial toaStr options */
        global.toastr.options.closeButton = true;
        global.toastr.options.progressBar = true;
        global.toastr.options.timeOut = 2500; // How long the toast will display without user interaction
        global.toastr.options.extendedTimeOut = 1000; // How long the toast will display after a user hovers over it
        global.toastr.options.showMethod = 'slideDown';
        global.toastr.options.hideMethod = 'fadeOut';
        global.toastr.options.closeMethod = 'fadeOut';
        global.toastr.options.closeDuration = 300;
        // global.toastr.options.positionClass = 'toast-top-center';
        global.Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this imaginary file!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    'Deleted!',
                    'Your imaginary file has been deleted.',
                    'success'
                )
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        })
    };

    Ym = new YmConstructor();
    YmConstructor.prototype.run = function () {
        Ym.toggleSideBar();
        Ym.initAllPlugins();
    };

    Ym.run();
    return Ym;
}));