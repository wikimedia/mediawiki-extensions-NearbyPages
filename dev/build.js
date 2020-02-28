const fs = require( 'fs' );
const mustache = require( 'mustache' );
const index = fs.readFileSync( `${__dirname}/index.mustache` ).toString();
const template = fs.readFileSync( `${__dirname}/../includes/templates/Nearby.mustache` ).toString();
const i18n = require( '../i18n/en.json' );

fs.writeFileSync( `${__dirname}/index.html`, mustache.render( index, {
    'html-body': mustache.render( template, {
        'heading': i18n['nearby-pages-info-heading'],
        'description': i18n['nearby-pages-info-description'],
        'button': i18n['nearby-pages-info-show-button'],
        'noscript-heading': i18n['nearby-pages-requirements'],
        'noscript-text': i18n['nearby-pages-requirements-guidance']
    } )
}) );
