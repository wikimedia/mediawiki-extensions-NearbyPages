const VueTestUtils = require( '@vue/test-utils' );
const Button = require( '../../resources/ext.nearby.scripts/Button.vue' );

describe( 'Button', () => {
	it( 'can be rendered easily without props', () => {
		const btn = VueTestUtils.mount( Button );

		expect(
			btn.classes()
		).toContain( 'mw-ui-button' );
	} );

	it( 'supports primary property', () => {
		const btn = VueTestUtils.mount( Button, {
			propsData: {
				primary: true
			}
		} );

		expect(
			btn.classes()
		).toContain( 'mw-ui-progressive' );
	} );
} );
