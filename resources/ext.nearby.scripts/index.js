// eslint-disable no-implicit-globals
var Vue = require( 'vue' ),
	btn = document.getElementById( 'mw-nearby-pages__activate' );

btn.addEventListener( 'click', function () {
	// eslint-disable-next-line no-new
	new Vue( {
		el: '#mw-nearby-pages',
		data: {
			message: mw.msg( 'nearby-pages-permission-denied' )
		},
		components: {
			errorbox: require( './Errorbox.vue' )
		},
		template: '<errorbox v-bind:message="message" />'
	} );
} );

btn.removeAttribute( 'disabled' );
