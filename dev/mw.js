const i18n = require( '../i18n/en.json' );
const config = require( '../resources/ext.nearby.scripts/config.json' );

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
        url: config.NearbyPagesUrl,
        xhrFields: {
            withCredentials: false
        },
        data
    } );
};

const configEl = document.getElementById( 'config' );
const htmlConfig = configEl ? JSON.parse( configEl.textContent ) : {};
module.exports = {
    Api,
    util: {
        getUrl: function ( title ) {
            return '#/wiki/' + title;
        }
    },
    language: {
        convertNumber: function ( a ) {
            return a;
        }
    },
    config: {
        get: function ( key ) {
            const params = new URLSearchParams( location.search );
            if ( params.get( key ) ) {
                return params.get( key );
            }
            switch ( key ) {
                case 'wgPageContentLanguage':
                    return 'en';
                default:
                    return null;
            }
        }
    },
    msg: function ( key ) {
        const params = Array.from(arguments).slice(1);
        let value = i18n[key].replace(/{{PLURAL\:\$1|.*\|(.*)}}/g, '$1');
        ( params ).forEach((val, i) => {
            value = value.replace('$' + ( i + 1 ), val);
        })
        return value;
    }
};
