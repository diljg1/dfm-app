<template>
    <div id="app">
        <div class="uk-section uk-section-default">
            <h1>Probeer de DigiFundManager Online</h1>
            <div class="uk-container">
                <div uk-grid>
                    <div class="uk-width-2-3@s">
                        <p>Vul de parameters in</p>
                        <p>
                            <button type="button"
                                    @click="request"
                                    class="uk-button uk-button-primary"
                                    :disabled="spinning">
                                Nu Berekenen
                            </button>
                        </p>
                        <div v-show="spinning" uk-spinner></div>

                        <div v-if="currentPreviewFilesReceived" class="uk-margin uk-grid-small uk-child-width-1-3@s" uk-grid>
                            <div><img :src="imageSources['sample_1.png']" alt="sample 1"/></div>
                            <div><img :src="imageSources['sample_2.png']" alt="sample 2"/></div>
                            <div><img :src="imageSources['sample_3.png']" alt="sample 3"/></div>
                        </div>
                    </div>
                    <div class="uk-width-1-3@s">
                        <p>Wacht op uw berekening</p>
                        <h3>{{ preview_id }}</h3>
                        <p>{{ currentPreviewStatus }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapState, mapGetters, mapActions,} from 'vuex';

import {POLLING_INTERVAL,} from '../config';

export default {

    name: 'App',

    data: () => ({
    }),

    computed: {
        spinning() {
            return this.status === 'pending';
        },
        imageSources() {
            const sources = {};
            Object.keys(this.currentPreviewFiles).forEach(filename => {
                sources[filename] = `data:image/png;base64,${this.currentPreviewFiles[filename]}`;
            });
            return sources;
        },
        ...mapState(['preview_id', 'params', 'options',]),
        ...mapGetters([
            'currentPreviewFilesReceived', 'currentPreview', 'currentPreviewStatus', 'currentPreviewFiles',
            'previewFilesReceived',
        ]),
    },

    methods: {
        request() {
            const options = {}; //todo set viewwidth etc
            this.requestPreview(options)
                .then(preview_id => this.startPolling(preview_id), error => this.error(error));
        },
        startPolling(preview_id) {
            let interval = setInterval(() => {
                if (!this.previewFilesReceived(preview_id)) {
                    this.pollPreview(preview_id)
                        .catch(error => this.error(error));
                } else {
                    clearInterval(interval);
                }
            }, POLLING_INTERVAL)
        },
        error(error) {
            //todo
            console.error(error);
        },
        ...mapActions(['requestPreview', 'pollPreview']),
    },
}
</script>

<style>

</style>
