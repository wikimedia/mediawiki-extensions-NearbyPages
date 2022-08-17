const fs = require( 'fs' );
const mustache = require( 'mustache' );
const index = fs.readFileSync( `${__dirname}/index.mustache` ).toString();
const template = fs.readFileSync( `${__dirname}/../includes/templates/Nearby.mustache` ).toString();
const i18n = require( '../i18n/en.json' );

const WIKIDATA_CONFIG = {
    NearbyPagesNamespaces: [ 640, 146, 0 ],
    NearbyPagesUrl: 'https://www.wikidata.org/w/api.php',
    NearbyPagesWikidataCompatibility: true
};

const DEFAULT_CONFIG = {};

const mwConfig = process.argv.includes( '--wikidata' ) ? WIKIDATA_CONFIG : DEFAULT_CONFIG;

fs.writeFileSync( `${__dirname}/index.html`, mustache.render( index, {
    'html-config': `mw.config.set(${ JSON.stringify( mwConfig ) });`,
    'html-body': mustache.render( template, {
        'noscript-heading': i18n['nearby-pages-requirements'],
        'noscript-text': i18n['nearby-pages-requirements-guidance']
    } )
}) );
