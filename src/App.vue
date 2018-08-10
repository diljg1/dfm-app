<template>
    <div id="app">
        <div class="uk-section uk-section-default">
            <h1>Probeer de DigiFundManager Online</h1>
            <div class="uk-container">
                <div class="uk-grid animated-grid">
                    <div :class="gridClasses.firstCol">
                        <div class="uk-flex uk-flex-center">
                            <div v-if="spinning" uk-spinner></div>
                            <div v-else-if="!currentPreviewFilesReceived">
                                <button type="button"
                                        @click="request"
                                        class="uk-button uk-button-primary">
                                    Nu Berekenen
                                </button>
                            </div>
                            <div v-if="currentPreviewFilesReceived">
                                <button type="button"
                                        @click="reset"
                                        class="uk-button"
                                        :disabled="spinning">
                                    Opnieuw
                                </button>
                            </div>
                        </div>

                        <template v-if="mode === 'form'">

                            <h3>Vul de parameters in</h3>

                            <ParamsForm class="uk-margin"></ParamsForm>

                        </template>
                        <template v-else="">

                            <h3>Uw parameters</h3>

                            <ParamsDisplay class="uk-margin"></ParamsDisplay>

                        </template>

                    </div>
                    <div :class="gridClasses.secondCol">
                        <ErrorMessage></ErrorMessage>
                        <Pending></Pending>
                        <div v-if="spinning" class="uk-margin">
                            <MessageScroll></MessageScroll>
                        </div>
                        <div v-if="currentPreviewFilesReceived" class="uk-card uk-card-body uk-card-default">
                            <Preview :preview-request="currentPreview"></Preview>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapState, mapGetters, mapActions, mapMutations,} from 'vuex';

import {SET_ERROR, RESET_ERROR, SET_SPINNING, RESET_PREVIEW,} from './store/mutation-types';
import {POLLING_INTERVAL,} from '../config';

export default {

    name: 'App',

    data: () => ({
        error: '',
    }),

    computed: {
        mode() {
            return (this.spinning || this.currentPreviewFilesReceived) ? 'display' : 'form';
        },
        gridClasses() {
            let firstCol = 'uk-width-3-4@s';
            let secondCol = 'uk-width-1-4@s';
            if (this.mode === 'display') {
                firstCol = 'uk-width-1-4@s';
                secondCol = 'uk-width-3-4@s';
            }
            return {firstCol, secondCol,};
        },
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
            reset: RESET_PREVIEW,
        }),
        ...mapActions(['requestPreview', 'pollPreview',]),
    },
}
</script>
<style scoped>
    .animated-grid > div {
        transition: width 0.5s linear;
    }
</style>