<?php

namespace NearbyPages;

use Config;
use MediaWiki\MediaWikiServices;
use SpecialPage;
use TemplateParser;

/**
 * Provide the Special page "Nearby" with location based articles
 */
class SpecialNearby extends SpecialPage {

	/**
	 * @var Config
	 */
	private $config;

	public function __construct() {
		parent::__construct( 'Nearby' );
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
			'wgNearbyRandomButton' => $this->config->get( 'NearbyRandomButton' ),
			'wgNearbyPagesUrl' => $this->config->get( 'NearbyPagesUrl' ),
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
