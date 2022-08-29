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
						url: '/wiki/Foo',
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
			pagelist.findAll( '.cdx-card' ).length
		).toBe( 2 );

		expect(
			pagelist.findAll( '.cdx-card' )[ 0 ]
				.find( '.mw-vue-page-list__card-proximity' )
				.element.getAttribute( 'href' )
		).toBe( 'geo:1,1' );
		expect(
			pagelist.find( '.cdx-card__text__title' ).text()
		).toBe( 'Foo' );
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
			pagelist.find( '.cdx-card__text__title' ).text()
		).toBe( 'Foo' );
		expect(
			pagelist.find( '.mw-vue-page-list__card-proximity' ).element.getAttribute( 'href' )
		).toBe( null );
	} );
} );
