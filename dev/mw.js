const i18n = require( '../i18n/en.json' );
const extConfig = require( '../extension.json' );

const Api = function () {};

Api.prototype.ajax = function ( params ) {
    let data = {};
    Object.keys( params ).forEach ( ( key ) => {
        if ( Array.isArray( params[ key ] ) ) {
            data[ key ] = params[ key ].join( '|' );
        } else {
            data[ key ] = params[ key ];
        }
    } );
    return $.ajax( {
        url: extConfig.config.NearbyPagesUrl,
        xhrFields: {
            withCredentials: false
        },
        data
    } );
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
    language: {
        convertNumber: function ( a ) {
            return a;
        }
    },
    msg: function ( key ) {
        return i18n[key];
    }
};
