var mwApi = new mw.Api( {
	ajax: {
		url: mw.config.get( 'wgNearbyPagesUrl' )
	}
} );

/**
 * Returns a human readable string stating the distance in meters or kilometers
 * depending on size.
 * @param {number} d distance in kilometers
 * @return {string} for current language
 */
function getDistanceMessage( d ) {
	var km;
	if ( d < 1 ) {
		d *= 100;
		d = Math.ceil( d ) * 10;
		if ( d === 1000 ) {
			km = '1';
		} else {
			return mw.msg( 'nearby-pages-distance-meters', mw.language.convertNumber( d ) );
		}
	} else {
		if ( d > 2 ) {
			d *= 10;
			d = Math.ceil( d ) / 10;
			km = d.toFixed( 1 );
		} else {
			d *= 100;
			d = Math.ceil( d ) / 100;
			km = d.toFixed( 2 );
		}
	}

	return mw.msg( 'nearby-pages-distance', mw.language.convertNumber( km ) );
}

/**
 * @param {Object} obj
 * @return {Card}
 */
function toCard( obj ) {
	var terms = obj.terms || {},
		coords = obj.coordinates || [ {} ],
		descriptions = [],
		description = terms.description ? terms.description[ 0 ] : obj.description,
		footnote = coords[ 0 ].dist ? getDistanceMessage( coords[ 0 ].dist / 1000 ) : '';

	if ( description ) {
		descriptions.push( description );
	}
	if ( footnote ) {
		descriptions.push( footnote );
	}

	return {
		url: terms.label ? mw.util.getUrl( obj.title ) : undefined,
		title: terms.label ? terms.label[ 0 ] : obj.title,
		description: descriptions,
		thumbnail: obj.thumbnail
	};
}

/**
 *
 * @param {string} lat
 * @param {string} lng
 * @param {ApiOptions} options
 * @return {jQuery.Deferred}
 */
function getPagesAtCoordinates( lat, lng, options ) {
	var coord = lat + '|' + lng,
		wikidataMode = options.wikidata,
		namespace = options.namespaces || [ 0 ],
		// T117159
		language = options.language || 'en',
		additionalProps = wikidataMode ? [ 'pageterms', 'description' ] : [];

	return mwApi.ajax( {
		wbptterms: wikidataMode ? [ 'label', 'description' ] : undefined,
		action: 'query',
		format: 'json',
		origin: '*',
		formatversion: 2,
		prop: [
			'coordinates', 'pageprops', 'pageimages', 'description'
		].concat( additionalProps ),
		colimit: 'max',
		generator: 'geosearch',
		ggsradius: options.range || 10000,
		ggsnamespace: namespace,
		ggslimit: 50,
		// T253215
		redirects: 'no',
		uselang: language,
		ggscoord: coord,
		ppprop: 'displaytitle',
		piprop: 'thumbnail',
		pithumbsize: 150,
		pilimit: 50,
		codistancefrompoint: coord
	} ).then( function ( data ) {
		return data && data.query ?
			data.query.pages.sort( function ( a, b ) {
				var c = a.coordinates || [ { dist: 0 } ],
					d = b.coordinates || [ { dist: 0 } ];

				return c[ 0 ].dist < d[ 0 ].dist ? -1 : 1;
			} ).map( toCard ) : [];
	} );
}

module.exports = {
	getPagesAtCoordinates: getPagesAtCoordinates,
	test: {
		toCard: toCard,
		getDistanceMessage: getDistanceMessage
	}
};
