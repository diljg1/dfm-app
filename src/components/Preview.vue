<template>

    <div>
        <h3>Resultaten</h3>
        <div class="uk-margin uk-grid-small uk-child-width-1-3@s" uk-grid>
            <div><img :src="imageSources['sample_1.png']" alt="sample 1"/></div>
            <div><img :src="imageSources['sample_2.png']" alt="sample 2"/></div>
            <div><img :src="imageSources['sample_3.png']" alt="sample 3"/></div>
        </div>
    </div>

</template>
<script>
    import PreviewRequest from '../lib/preview-request';

    export default {

        name: 'Preview',

        props: {
            previewRequest: PreviewRequest,
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