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
                        <ErrorMessage></ErrorMessage>
                        <Pending></Pending>
                    </div>
                </div>
                <div v-if="spinning" class="uk-margin">
                    <MessageScroll></MessageScroll>
                </div>
                <div v-if="currentPreviewFilesReceived" class="uk-margin uk-card uk-card-body uk-card-default">
                    <Preview :preview-request="currentPreview"></Preview>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapState, mapGetters, mapActions, mapMutations,} from 'vuex';

import {SET_ERROR, RESET_ERROR, SET_SPINNING,} from './store/mutation-types';
import {POLLING_INTERVAL,} from '../config';

export default {

    name: 'App',

    data: () => ({
        error: '',
    }),

    computed: {
        imageSources() {
            const sources = {};
            Object.keys(this.currentPreviewFiles).forEach(filename => {
                sources[filename] = `data:image/png;base64,${this.currentPreviewFiles[filename]}`;
            });
            return sources;
        },
        ...mapState(['spinning', 'preview_id', 'params', 'options',]),
        ...mapGetters([
            'currentPreviewFilesReceived', 'currentPreview', 'currentPreviewStatus', 'currentPreviewFiles',
            'previewFilesReceived',
        ]),
    },

    watch: {
        'currentPreviewStatus'(value) {
            if (value !== 'pending') {
                this.setSpinning(false);
            }
        },
    },

    methods: {
        request() {
            this.setSpinning(true);
            const options = {}; //todo set viewwidth etc
            this.resetError();
            this.requestPreview(options)
                .then(preview_id => this.startPolling(preview_id), this.apiError);
        },
        startPolling(preview_id) {
            let interval = setInterval(() => {
                if (!this.previewFilesReceived(preview_id)) {
                    this.pollPreview(preview_id)
                        .catch(this.apiError);
                } else {
                    clearInterval(interval);
                }
            }, POLLING_INTERVAL)
        },
        apiError({error, status,}) {
            let userError = error;
            if (status >= 500) {
                userError = 'Api server fout. Probeer het later opnieuw.';
                if (console) {
                    console.error(error);
                }
            }
            this.setSpinning(false);
            this.setError(userError);
        },
        ...mapMutations({
            setSpinning: SET_SPINNING,
            setError: SET_ERROR,
            resetError: RESET_ERROR,
        }),
        ...mapActions(['requestPreview', 'pollPreview',]),
    },
}
</script>
