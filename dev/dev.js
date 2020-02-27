const mustache = require( 'mustache' );
const fs = require( 'fs' );
const i18n = require( '../i18n/en.json' );
const template = fs.readFileSync( `${__dirname}/../includes/templates/Nearby.mustache` ).toString();
window.mw = {};

document.getElementById( 'dev-container' ).innerHTML = mustache.render( template, {
    'heading': i18n['nearby-pages-info-heading'],
    'description': i18n['nearby-pages-info-description'],
    'button': i18n['nearby-pages-info-show-button'],
    'noscript-heading': i18n['nearby-pages-requirements'],
    'noscript-text': i18n['nearby-pages-requirements-guidance']
} );

// load CSS
require( '../resources/ext.nearby.styles/index.less' );
