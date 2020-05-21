const i18n = require( '../i18n/en.json' );
const extConfig = require( '../extension.json' );

const Api = function () {};

const toQueryStringValue = ( value ) => {
    return encodeURIComponent( typeof value === 'object' ? value.join( '|' ) : value );
};

Api.prototype.ajax = function ( params ) {
    params['origin'] = '*';
    const q = Object.keys( params ).map( ( key ) => {
        return `${key}=${toQueryStringValue(params[key])}`;
    } ).join('&');
    return fetch(`${extConfig.config.NearbyPagesUrl}?${q}`).then( ( r )=>r.json() );
};

module.exports = {
    Api,
    util: {
        getUrl: function ( title ) {
            return '#/wiki/' + title;
        }
    },
    config: {
        get: function ( name ) {
            name = name.replace( 'wg', '' );
            return extConfig.config[name] || null;
        }
    },
    msg: function ( key ) {
        return i18n[key];
    }
};
