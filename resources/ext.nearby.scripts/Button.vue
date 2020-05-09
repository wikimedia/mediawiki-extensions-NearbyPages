<template>
    <button class="mw-ui-button" v-bind:class="additionalClassNames"
        v-on:click="$emit('click')"><slot /></button>
</template>

<script>
/**
 * A good old fashioned mediawiki ui button
 * @module Button
 * @param {boolean} primary whether the button should be considered primary
 */
module.exports = {
    name: 'mw-button',
    computed: {
        /**
         * @return {Object} representing mapping of classes. Keys are classes
         *  and their values are where to apply them
         */
        additionalClassNames: function () {
            return {
                'mw-ui-progressive': this.primary,
            };
        }
    },
    props: [ 'primary' ]
};
</script>
