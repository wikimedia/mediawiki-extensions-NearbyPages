var mwApi = new mw.Api( {
	ajax: {
		url: mw.config.get( 'wgNearbyPagesUrl' )
	}
} );

function getPagesAtCoordinates( lat, lng ) {
	var coord = lat + '|' + lng;

	return mwApi.ajax( {
		action: 'query',
		format: 'json',
		origin: '*',
		formatversion: 2,
		prop: [ 'coordinates', 'pageprops', 'pageimages', 'description' ],
		colimit: 'max',
		generator: 'geosearch',
		ggsradius: mw.config.get( 'wgNearbyRange' ),
		ggsnamespace: 0,
		ggslimit: 50,
		ggscoord: coord,
		ppprop: 'displaytitle',
		piprop: 'thumbnail',
		pithumbsize: 150,
		pilimit: 50,
		codistancefrompoint: coord
	} ).then( function ( data ) {
		return data && data.query ? data.query.pages : [];
	} );
}

module.exports = {
	getPagesAtCoordinates: getPagesAtCoordinates
};
