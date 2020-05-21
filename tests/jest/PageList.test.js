const VueTestUtils = require( '@vue/test-utils' );
const PageList = require( '../../resources/ext.nearby.scripts/PageList.vue' );

describe( 'PageList', () => {

	it( 'renders cards', () => {
		const pagelist = VueTestUtils.mount( PageList, {
			propsData: {
				pages: [
					{
						title: 'Foo'
					},
					{
						title: 'Bar'
					}
				]
			}
		} );

		expect(
			pagelist.findAll( '.mw-vue-card' ).length
		).toBe( 2 );
	} );
} );
