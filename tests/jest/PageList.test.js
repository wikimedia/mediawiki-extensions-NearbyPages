const VueTestUtils = require( '@vue/test-utils' );
const PageList = require( '../../resources/ext.nearby.scripts/PageList.vue' );

describe( 'PageList', () => {
	it( 'renders cards', () => {
		const pagelist = VueTestUtils.mount( PageList, {
			propsData: {
				supportsGeoUrlProtocol: true,
				cardUrl: '/wiki/$1',
				pages: [
					{
						title: 'Foo',
						id: 'Foo',
						geoURI: 'geo:1,1',
						thumbnail: {
							source: 'banana.gif'
						}
					},
					{
						title: 'Bar'
					}
				]
			}
		} );

		expect(
			pagelist.findAll( '.mw-vue-page-list__card' ).length
		).toBe( 2 );

		expect(
			pagelist.findAll( '.mw-vue-page-list__card' )
				.at( 0 ).find( '.mw-vue-page-list__card-proximity' )
				.element.getAttribute( 'href' )
		).toBe( 'geo:1,1' );
	} );
} );

describe( 'PageList where no geo uri support', () => {
	it( 'renders cards without geo uri links', () => {
		const pagelist = VueTestUtils.mount( PageList, {
			propsData: {
				supportsGeoUrlProtocol: false,
				pages: [
					{
						title: 'Foo',
						geoURI: 'geo:0,0',
						thumbnail: {
							source: 'banana.gif'
						}
					}
				]
			}
		} );

		expect(
			pagelist.find( '.mw-vue-page-list__card-proximity' ).element.getAttribute( 'href' )
		).toBe( null );
	} );
} );
