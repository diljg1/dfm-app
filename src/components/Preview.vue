<template>

    <div>
        <div class="uk-margin uk-grid-small uk-text-center" uk-grid>
            <div class="uk-width-1-3@s">
                <img :src="imageSources['output_1']" alt="sample 1"/>
            </div>
            <div class="uk-width-2-3@s">
                <img :src="imageSources['output_3']" alt="sample 3"/>
                <h3>{{ 'Huidige optimale portefeuille' | trans }}</h3>
                <img :src="imageSources['output_2']" alt="sample 2"/>
            </div>
        </div>
    </div>

</template>
<script>

    export default {

        name: 'Preview',

        props: {
            previewRequest: Object,
        },

        computed: {
            imageSources() {
                const sources = {};
                Object.keys(this.previewRequest.files).forEach(filename => {
                    sources[filename] = `data:image/png;base64,${this.previewRequest.files[filename]}`;
                });
                return sources;
            },
        },
    }

</script>