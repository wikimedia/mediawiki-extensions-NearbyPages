<template>
    <button class="mw-ui-button" v-bind:class="additionalClassNames"
        v-on:click="$emit('click')"><slot /></button>
</template>

<script>
module.exports = {
    name: 'mw-button',
    computed: {
        additionalClassNames: function () {
            return {
                'mw-ui-progressive': this.primary,
            };
        }
    },
    props: [ 'primary' ]
};
</script>
