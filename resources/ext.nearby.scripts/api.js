var mwApi = new mw.Api( {
	ajax: {
		url: mw.config.get( 'wgNearbyPagesUrl' )
	}
} );

/**
 * @param {Object} obj
 * @return {Card}
 */
function toCard( obj ) {
	var terms = obj.terms || {},
		description = terms.description ? terms.description[ 0 ] : obj.description;

	return {
		url: terms.label ? mw.util.getUrl( obj.title ) : undefined,
		title: terms.label ? terms.label[ 0 ] : obj.title,
		description: description,
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
			data.query.pages.map( toCard ) : [];
	} );
}

module.exports = {
	test: {
		toCard: toCard
	},
	getPagesAtCoordinates: getPagesAtCoordinates
};
