# Installation

```
wfLoadExtension( 'NearbyPages' );
```

## Sourcing content

To get NearbyPages showing articles from your favorite mediawiki instance you'll
need to first config the $wgNearbyPagesUrl config variable.

```
$wgNearbyPagesUrl = "https://en.wikipedia.org/w/api.php";
```

For wikidata wikis a little more configuration is required like so:

```
$wgNearbyPagesNamespaces = [ 640, 146, 0 ];
$wgNearbyPagesWikidataCompatibility = true;
$wgNearbyPagesUrl = "https://www.wikidata.org/w/api.php";
```

## Note for wikis running MobileFrontend

To avoid compatibility issues, ensure that MobileFrontend version 2.3.0 is running.

## Development
You can begin development on Special:NearbyPages with 2 simple commands:
```
npm install
npm start
```
