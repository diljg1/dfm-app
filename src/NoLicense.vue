<template>
    <div v-if="noLicense" class="uk-card uk-card-default uk-padding-small">
        <div class="cursor-pointer uk-text-center uk-margin-remove-top"
             @click="$bus.$emit('modal:license_key')"
             v-html="noLicenseText">

        </div>
        <div class="uk-margin uk-flex uk-flex-center">
            <a v-if="false" class="uk-button uk-button-small uk-button-primary uk-margin-small-right"
               :href="links.trial_link" target="_blank" rel="noopener noreferrer">
                {{ 'Koop 30-dagen trial €30' | trans }}
            </a>
            <a class="uk-button uk-button-small uk-button-primary uk-margin-small-right"
               :href="links.license_link" target="_blank" rel="noopener noreferrer">
                {{ 'Koop jaarlicentie €300' | trans }}
            </a>
            <a class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
               :href="links.csi_link" target="_blank" rel="noopener noreferrer">
                {{ 'Koop CSI data jaarabonnement' | trans }}
            </a>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';

export default {

    name: 'NoLicense',

    computed: {
        noLicenseText() {
            return this.isTrial ?
                this.$trans('trial_text').replace('%date%', this.trialEndDate) :
                this.$trans('no_license_text')
        },
        trialEndDate() {
            return this.trialEnd ? new Date(this.trialEnd).toLocaleDateString() : '';
        },
        ...mapState({
            isTrial: state => state.user.isTrial,
            noLicense: state => state.user.noLicense,
            trialEnd: state => state.user.trialEnd,
        }),
        ...mapState({
            links: state => state.links,
        }),
    },
}
</script>
<style lang="less">
@import '~uikit/src/less/components/variables';

.uk-select:not([multiple]):not([size]) option {
    color: @global-inverse-color !important;
}

.cursor-pointer {
    cursor: pointer;
}

</style>
<style lang="less" scoped>
.animated-grid > div {
    transition: width 0.4s ease;
}
</style>
