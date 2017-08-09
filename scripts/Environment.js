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

    /**
     * Check whether user agent is an Android browser.
     *
     * @return {string[]|null}
     */
    isAndroid() {
        return navigator.userAgent.match(/Android/i);
    },

    /**
     * Check whether user agent is a Black Berry browser.
     *
     * @return {string[]|null}
     */
    isBlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i);
    },

    /**
     * Check whether user agent is an iOS browser.
     *
     * @return {string[]|null}
     */
    isIOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },

    /**
     * Check whether user agent is an Opera browser.
     *
     * @return {string[]|null}
     */
    isOpera() {
        return navigator.userAgent.match(/Opera Mini/i);
    },

    /**
     * Check whether user agent is a Windows browser.
     *
     * @return {string[]|null}
     */
    isWindows() {
        return navigator.userAgent.match(/IEMobile/i);
    },

    /**
     * Check whether user agent is a Mobile browser.
     *
     * @return {string[]|null}
     */
    isMobile() {
        return this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isOpera() || this.isWindows();
    }
};