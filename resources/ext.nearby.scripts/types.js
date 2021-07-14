/**
 * @typedef {Object} CardThumbnail
 * @property {string} source uri for image
 */

/**
 * @typedef {Object} ApiOptions
 * @property {number} [range] of request in meters
 * @property {string} [language] of api request
 * @property {boolean} [wikidata] whether the api
 *  should operate in wikidata compatibility mode.
 * @property {Array} [namespaces] to search for nearby pages
 */

/**
 * @typedef {Object} Card
 * @property {string} title
 * @property {string} id usually same as title, except on Wikidata.org
 * @property {CardThumbnail} [thumbnail]
 * @property {string} [description]
 * @property {string} [proximity] of landmark with unit in km or meters
 * @property {string} [url] if present the title will not be used as the URI
 */

/**
 * @typedef AppData
 * @property {Card[]} pages
 * @property {boolean} includeRandomButton
 * @property {boolean} error
 */

/**
 * @typedef {Object} Coordinate
 * @property {number} latitude
 * @property {number} longitude
 */
