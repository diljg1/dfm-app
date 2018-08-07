<template>
    <div id="app">
        <div class="uk-section uk-section-default">
            <h1>Probeer de DigiFundManager Online</h1>
            <div class="uk-container">
                <div uk-grid>
                    <div class="uk-width-2-3@s">
                        <div class="uk-flex uk-flex-middle uk-flex-between">
                            <h3 class="uk-margin-remove">Vul de parameters in</h3>
                            <div v-if="spinning" uk-spinner></div>
                            <div>
                                <button type="button"
                                        @click="request"
                                        class="uk-button uk-button-primary"
                                        :disabled="spinning">
                                    Nu Berekenen
                                </button>
                            </div>
                        </div>

                        <ParamsForm class="uk-margin"></ParamsForm>

                    </div>
                    <div class="uk-width-1-3@s">
                        <Pending></Pending>
                    </div>
                </div>
                <div v-if="currentPreviewFilesReceived" class="uk-margin uk-card uk-card-body uk-card-default">
                    <Preview :preview-request="currentPreview"></Preview>
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
            return this.currentPreviewStatus === 'pending';
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
