// eslint-disable no-implicit-globals
var Vue = require( 'vue' ),
	App = require( './App.vue' );

// eslint-disable-next-line no-new
new Vue( {
	el: '#mw-nearby-pages',
	render: function ( h ) {
		return h( App );
	}
} );
