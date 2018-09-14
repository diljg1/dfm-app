<template>

    <div class="uk-margin uk-flex uk-flex-center">
        <a class="uk-button uk-button-small uk-button-primary uk-margin-small-right"
           :href="links.trial_link" target="_blank" rel="noopener noreferrer">{{ 'Koop 30-dagen trial €30' | trans }}</a>
        <a class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
           :href="links.license_link" target="_blank" rel="noopener noreferrer">{{ 'Koop jaarlicentie €300' | trans }}</a>
        <a class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
           :href="links.csi_link" target="_blank" rel="noopener noreferrer">{{ 'Koop CSI data jaarabonnement' | trans }}</a>
    </div>

</template>
<script>

    export default {

        name: 'ActionButtons',

        props: {},

    }

</script>