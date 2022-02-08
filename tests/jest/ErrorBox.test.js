const VueTestUtils = require( '@vue/test-utils' );
const ErrorBox = require( '../../resources/ext.nearby.scripts/Errorbox.vue' );

describe( 'ErrorBox', () => {

	it( 'renders', () => {
		const errorBox = VueTestUtils.mount( ErrorBox, {
			propsData: {
				message: 'A nasty error'
			}
		} );

		expect( errorBox.classes() ).toContain( 'mw-message-box-error' );
		expect( errorBox.text() ).toBe( 'A nasty error' );
	} );
} );
