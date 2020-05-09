<template>
    <div class="errorbox">{{ message }}</div>
</template>

<script>
/**
 * A good old fashioned mediawiki error box.
 * @module Errorbox
 * @param {string} message to display to user. no html allowed.
 */
module.exports = {
    props: [ 'message' ]
};
</script>
