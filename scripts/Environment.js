/* ----------------------------------------------------------------------------
 * Spaceguard - Arcade Space Game written in JavaScript
 *
 * @package     Spaceguard
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://alextselegidis.com/spaceguard
 * ---------------------------------------------------------------------------- */

/**
 * Check user agent device type.
 *
 * {@link http://stackoverflow.com/a/16755700/1718162}
 */
export default {
    // Mobile or desktop compatible event name, to be used with '.on' function.
    TOUCH_DOWN_EVENT_NAME: 'mousedown touchstart',
    TOUCH_UP_EVENT_NAME: 'mouseup touchend',
    TOUCH_MOVE_EVENT_NAME: 'mousemove touchmove',
    TOUCH_DOUBLE_TAB_EVENT_NAME: 'dblclick dbltap',

    isAndroid: function () {
        return navigator.userAgent.match(/Android/i);
    },

    isBlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },

    isIOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },

    isOpera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },

    isWindows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },

    isMobile: function () {
        return (this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isOpera() || this.isWindows());
    }
};