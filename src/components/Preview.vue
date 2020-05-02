<template>

    <div>
        <div class="uk-margin uk-flex uk-flex-center">
            <a class="uk-button uk-button-small uk-button-primary uk-margin-small-right"
               :href="links.trial_link" target="_blank" rel="noopener noreferrer">{{ 'Koop 30-dagen trial €30' | trans }}</a>
            <a class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
               :href="links.license_link" target="_blank" rel="noopener noreferrer">{{ 'Koop jaarlicentie €300' | trans }}</a>
            <a class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
               :href="links.csi_link" target="_blank" rel="noopener noreferrer">{{ 'Koop CSI data jaarabonnement' | trans }}</a>
        </div>
        <div class="uk-margin uk-grid-small uk-text-center" uk-grid>
            <div class="uk-width-1-4@s">
                <img :src="imageSources['output_1.png']" alt="outputimage 1"/>
            </div>
            <div class="uk-width-3-4@s">
                <img :src="imageSources['output_2.png']" alt="outputimage 2"/>
                <img :src="imageSources['output_3.png']" alt="outputimage 3" class="uk-margin-small-top"/>
            </div>
        </div>
    </div>

</template>
<script>
    import {mapState,} from 'vuex';
    import Papa from 'papaparse';

    export default {

        name: 'Preview',

        props: {
            previewRequest: Object,
        },

        computed: {
            csvSources() {
                const sources = {};
                Object.keys(this.previewRequest.files).filter(filename => filename.includes('.csv')).forEach(filename => {
                    sources[filename] = Papa.parse(this.previewRequest.files[filename], {
                        delimiter: ';',
                        newline: "\n",
                        header: true,
                    });
                });
                console.log(sources);
                return sources;
            },
            imageSources() {
                const sources = {};
                Object.keys(this.previewRequest.files).filter(filename => filename.includes('.png')).forEach(filename => {
                    sources[filename] = `data:image/png;base64,${this.previewRequest.files[filename]}`;
                });
                return sources;
            },
            ...mapState({
                links: state => state.links,
            }),
        },
    }

</script>
