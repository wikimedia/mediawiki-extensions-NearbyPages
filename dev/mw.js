const i18n = require( '../i18n/en.json' );

const Api = function () {};

const toQueryStringValue = ( value ) => {
    return encodeURIComponent( typeof value === 'object' ? value.join( '|' ) : value );
};

Api.prototype.ajax = function ( params ) {
    params['origin'] = '*';
    const q = Object.keys( params ).map( ( key ) => {
        return `${key}=${toQueryStringValue(params[key])}`;
    } ).join('&');
    return fetch(`https://en.wikipedia.org/w/api.php?${q}`).then( ( r )=>r.json() );
};

window.mw = {
    Api,
    util: {
        getUrl: function ( title ) {
            return '#/wiki/' + title;
        }
    },
    config: {
        get: function ( name ) {
            switch ( name ) {
                case "wgNearbyRandomButton":
                    return true;
                case 'wgNearbyPagesUrl':
                    return 'https://en.wikipedia.org/w/api.php';
                case 'wgNearbyRange':
                    return 1000;
                default:
                    return null;
            }
        }
    },
    msg: function ( key ) {
        return i18n[key];
    }
};
