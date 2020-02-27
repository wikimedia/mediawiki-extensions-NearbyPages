<?php

namespace NearbyPages;

use Html;
use SpecialPage;
use TemplateParser;
use MediaWiki\MediaWikiServices;

/**
 * Provide the Special page "Nearby" with location based articles
 */
class SpecialNearby extends SpecialPage {
	public function __construct() {
		parent::__construct( 'Nearby' );
		$this->listed = true;
		$services = MediaWikiServices::getInstance();
		$this->config = $services->getService( 'MobileFrontend.Config' );
	}

	/**
	 * Render Special Page Nearby
	 * @param string|null $par Parameter submitted as subpage
	 */
	public function execute( $par = '' ) {
		parent::execute( $par );
		$out = $this->getOutput();
		// set config
		$out->addJsConfigVars( [
			'wgNearbyRange' => $this->config->get( 'NearbyRange' ),
		] );
		$out->addModuleStyles( [
			'ext.nearbypages.images',
			'ext.nearby.styles'
		] );
		$out->addModules( [
			'ext.nearby.scripts'
		] );
		$out->setPageTitle( $this->msg( 'nearby-pages-title' ) );

		$tp = new TemplateParser( __DIR__ . '/templates' );
		$html = $tp->processTemplate( 'Nearby', [
			'heading' => $this->msg( 'nearby-pages-info-heading' )->text(),
			'description' => $this->msg( 'nearby-pages-info-description' )->text(),
			'button' => $this->msg( 'nearby-pages-info-show-button' )->text(),
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