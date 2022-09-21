const mwApi = new mw.Api( {
	ajax: {
		url: mw.config.get( 'wgNearbyPagesUrl' )
	}
} );

/**
 * Returns a human readable string stating the distance in meters or kilometers
 * depending on size.
 *
 * @param {number} d distance in kilometers
 * @return {string} for current language
 */
function getDistanceMessage( d ) {
	let km;
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
	const terms = obj.entityterms || obj.terms || {},
		coords = obj.coordinates || [ {} ],
		coordinates = coords[ 0 ],
		description = terms.description ? terms.description[ 0 ] : obj.description,
		proximity = coordinates.dist !== undefined ?
			getDistanceMessage( coordinates.dist / 1000 ) : undefined;

	return {
		url: obj.fullurl,
		title: terms.label ? terms.label[ 0 ] : obj.title,
		id: obj.title,
		description: description,
		geoURI: coordinates.lat && coordinates.lon ?
			'geo:' + coordinates.lat + ',' + coordinates.lon : undefined,
		proximity: proximity,
		thumbnail: obj.thumbnail
	};
}

/**
 * @return {jQuery.Deferred} resolving to a list of pages.
 */
function getRandomPages() {
	return mwApi.ajax( {
		action: 'query',
		format: 'json',
		origin: '*',
		prop: 'coordinates|info',
		inprop: 'url',
		generator: 'random',
		formatversion: 2,
		colimit: 100,
		grnnamespace: 0,
		grnlimit: 100
	} ).then( function ( data ) {
		return data.query.pages;
	} );
}

/**
 *
 * @param {Object} reqData to send to the api request
 * @param {ApiOptions} options
 * @return {jQuery.Deferred}
 */
function getPages( reqData, options ) {
	const wikidataMode = options.wikidata,
		namespace = options.namespaces || [ 0 ],
		// T117159
		language = options.language || 'en',
		additionalProps = wikidataMode ? [ 'entityterms' ] : [ 'pageterms' ];

	return mwApi.ajax( $.extend( {
		wbetterms: wikidataMode ? [ 'label', 'description' ] : undefined,
		action: 'query',
		format: 'json',
		origin: '*',
		formatversion: 2,
		prop: [
			'coordinates', 'pageprops', 'pageimages', 'description', 'info'
		].concat( additionalProps ),
		inprop: 'url',
		colimit: 'max',
		generator: 'geosearch',
		ggsradius: options.range || 10000,
		ggsnamespace: namespace,
		ggslimit: 50,
		// T253215
		redirects: 'no',
		uselang: language,
		ppprop: 'displaytitle',
		piprop: 'thumbnail',
		pithumbsize: 150,
		pilimit: 50
	}, reqData ) ).then( function ( data ) {
		const queryPages = data && data.query ? data.query.pages : [],
			pages = queryPages.sort( function ( a, b ) {
				const c = a.coordinates || [ { dist: 0 } ],
					d = b.coordinates || [ { dist: 0 } ];

				return c[ 0 ].dist < d[ 0 ].dist ? -1 : 1;
			} ).map( toCard ),
			coords = queryPages.length && queryPages[ 0 ].coordinates || [ {} ];

		return {
			pages: pages,
			latitude: coords[ 0 ].lat,
			longitude: coords[ 0 ].lon
		};
	} );
}

/**
 * @param {string} lat
 * @param {string} lng
 * @param {ApiOptions} options
 * @return {jQuery.Object}
 */
function getPagesAtCoordinates( lat, lng, options ) {
	const coord = lat + '|' + lng;

	return getPages( {
		codistancefrompoint: coord,
		ggscoord: coord
	}, options );
}

/**
 * @param {string} title to get coordinates for
 * @param {ApiOptions} options
 * @return {jQuery.Deferred}
 */
function getPagesNearbyPage( title, options ) {
	return getPages( {
		codistancefrompage: title,
		ggspage: title
	}, options );
}

module.exports = {
	getRandomPages: getRandomPages,
	getPagesAtCoordinates: getPagesAtCoordinates,
	getPagesNearbyPage: getPagesNearbyPage,
	test: {
		toCard: toCard,
		getDistanceMessage: getDistanceMessage
	}
};
