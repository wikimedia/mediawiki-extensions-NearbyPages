const Vue = require( '~/../node_modules/vue/dist/vue.common.dev.js' );

Vue.createMwApp = function ( App ) {
	return {
		mount: function ( el ) {
			return new Vue( {
				el,
				render: function ( h ) {
					return h( App );
				}
			} );
		}
	}
};
module.exports = Vue;
