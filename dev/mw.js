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
        url: extConfig.config.NearbyPagesUrl.value,
        xhrFields: {
            withCredentials: false
        },
        data
    } );
};

const configEl = document.getElementById( 'config' );
const htmlConfig = configEl ? JSON.parse( configEl.textContent ) : {};
let config = Object.assign( {}, htmlConfig );
Object.keys( extConfig.config ).forEach( ( key ) => {
    config[ `wg${key}` ] = extConfig.config[ key ].value;
} )
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
    msg: function ( key ) {
        const params = Array.from(arguments).slice(1);
        let value = i18n[key].replace(/{{PLURAL\:\$1|.*\|(.*)}}/g, '$1');
        ( params ).forEach((val, i) => {
            value = value.replace('$' + ( i + 1 ), val);
        })
        return value;
    }
};
