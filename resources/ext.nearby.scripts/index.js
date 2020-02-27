// eslint-disable no-implicit-globals
var Vue = require( 'vue' ),
	btn = document.getElementById( 'mw-nearby-pages__activate' );

btn.addEventListener( 'click', function () {
	// eslint-disable-next-line no-new
	new Vue( {
		el: '#mw-nearby-pages',
		template: '<div>TODO</div>'
	} );
} );

btn.removeAttribute( 'disabled' );
