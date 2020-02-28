const i18n = require( '../i18n/en.json' );
window.mw = {
    msg: function ( key ) {
        return i18n[key];
    }
};
