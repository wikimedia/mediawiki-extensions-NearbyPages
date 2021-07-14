<?php

namespace NearbyPages;

use SpecialPage;
use TemplateParser;

/**
 * Provide the Special page "Nearby" with location based articles
 */
class SpecialNearby extends SpecialPage {

	public function __construct() {
		parent::__construct( 'Nearby' );
	}

	/**
	 * Render Special Page Nearby
	 * @param string|null $par Parameter submitted as subpage
	 */
	public function execute( $par = '' ) {
		parent::execute( $par );
		$out = $this->getOutput();
		// set config
		$config = $this->getConfig();
		$out->addJsConfigVars( [
			'wgNearbyPagesWikidataCompatibility' => $config->get( 'NearbyPagesWikidataCompatibility' ),
			'wgNearbyPagesNamespaces' => $config->get( 'NearbyPagesNamespaces' ),
			'wgNearbyRange' => $config->get( 'NearbyRange' ),
			'wgNearbyCardUrl' => $config->get( 'NearbyCardUrl' ),
			'wgNearbyRandomButton' => $config->get( 'NearbyRandomButton' ),
			'wgNearbyPagesUrl' => $config->get( 'NearbyPagesUrl' ),
		] );
		$out->addModuleStyles( [
			'ext.nearby.images',
			'ext.nearby.styles'
		] );
		$out->addModules( [
			'ext.nearby.scripts'
		] );
		$out->setPageTitle( $this->msg( 'nearby-pages-title' ) );

		$tp = new TemplateParser( __DIR__ . '/templates' );
		$html = $tp->processTemplate( 'Nearby', [
			'noscript-heading' => $this->msg( 'nearby-pages-requirements' )->text(),
			'noscript-text' => $this->msg( 'nearby-pages-requirements-guidance' )->text(),
		] );

		$out->addHTML( $html );
	}

	/**
	 * @return string
	 */
	protected function getGroupName() {
		return 'pages';
	}
}
