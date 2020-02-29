const i18n = require( '../i18n/en.json' );

function makeApi() {
    const Api = function () {};
    /**
     * usage: api.get('https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=info&inprop=watched&pageids=3613583%7C176931%7C11002203%7C6761105%7C17106899%7C1814119%7C4685984%7C5644546%7C5209675%7C38153743%7C6113484%7C17656780%7C1711920%7C2341155%7C2917295%7C2916970%7C283402%7C60845480%7C56887680%7C19617685%7C6365582%7C21308344%7C5979155%7C2248743%7C498041%7C8795632%7C21986283%7C30876663%7C4111945%7C33956219%7C59988056%7C3509876%7C10626244%7C20909768%7C59480%7C2947902%7C415576%7C804176%7C10331800%7C3271581%7C1693413%7C39206892%7C9493616%7C13329368%7C20602207%7C30854553%7C4805527%7C4122301%7C14714023%7C30862667&origin=*').then((t)=>console.log(t))
     */
    Api.prototype.get = function (uri) {
        return fetch(uri).then((r) => r.json())
    };
    return Api;
}

window.mw = {
    Api: makeApi(),
    config: {
        get: function ( name ) {
            switch ( name ) {
                case 'NearbyRange':
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
