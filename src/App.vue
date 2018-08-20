<template>
    <div id="app">
        <div class="uk-section uk-section-default">
            <h1>{{ 'Probeer de DigiFundManager Online' | trans }}</h1>
            <div class="uk-container">
                <div class="uk-grid animated-grid">
                    <div :class="gridClasses.firstCol">
                        <div class="uk-flex uk-flex-center uk-flex-middle">
                            <div v-if="isSpinning" uk-spinner></div>
                            <div v-else-if="!currentPreviewFilesReceived">
                                <button type="button"
                                        @click="resetParams"
                                        class="uk-button uk-button-small uk-margin-right">
                                    {{ 'Standaardwaarden' | trans }}
                                </button>
                                <button type="button"
                                        @click="request"
                                        class="uk-button uk-button-primary">
                                    <span uk-icon="check"></span>
                                    {{ 'Nu Berekenen' | trans }}
                                </button>
                            </div>
                            <div v-if="currentPreviewFilesReceived">
                                <button type="button"
                                        @click="reset"
                                        class="uk-button">
                                    {{ 'Opnieuw' | trans }}
                                </button>
                            </div>
                        </div>

                        <transition name="fade" mode="out-in">
                            <div v-if="mode === 'form'" key="form" class="uk-margin">

                                <h3>{{ 'Vul de parameters in' | trans }}</h3>

                                <ParamsForm class="uk-margin"></ParamsForm>

                            </div>
                            <div v-if="mode === 'display'" key="display" class="uk-margin">

                                <h3>{{ 'Uw parameters' | trans }}</h3>

                                <ParamsDisplay class="uk-margin"></ParamsDisplay>

                            </div>
                        </transition>

                    </div>
                    <div :class="gridClasses.secondCol">
                        <ErrorMessage></ErrorMessage>
                        <transition name="fade" mode="out-in">
                            <div v-if="!currentPreviewFilesReceived"
                                 key="pending" class="uk-margin">
                                <Pending></Pending>
                                <MessageScroll v-if="isSpinning"></MessageScroll>
                            </div>
                            <div v-if="currentPreviewFilesReceived"
                                 key="results" class="uk-card uk-card-body uk-card-default">
                                <Preview :preview-request="currentPreview"></Preview>
                            </div>
                        </transition>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapState, mapGetters, mapActions, mapMutations,} from 'vuex';

import {SET_ERROR, RESET_UI, RESET_PREVIEW, SET_PREVIEW_STATUS,} from './store/mutation-types';
import {POLLING_INTERVAL, STORAGEKEY_PENDING_PREVIEW,} from '../config';

export default {

    name: 'App',

    computed: {
        mode() {
            return (this.isSpinning || this.currentPreviewFilesReceived) ? 'display' : 'form';
        },
        gridClasses() {
            let firstCol = 'uk-width-3-4@m';
            let secondCol = 'uk-width-1-4@m';
            if (this.mode === 'display') {
                firstCol = 'uk-width-1-4@m';
                secondCol = 'uk-width-3-4@m';
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
        ...mapState({
            currentPreview: state => state.preview,
            error: state => state.error,
            params: state => state.params.params,
        }),
        ...mapGetters([
            'isSpinning',
            'currentPreviewFilesReceived', 'currentPreviewStatus', 'currentPreviewFiles', 'currentPreviewExpired',
        ]),
    },

    watch: {
        'currentPreviewExpired'(value) {
            if (value) {
                this.resetUi();
                this.setPreviewStatus('expired');
            }
        },
    },

    created() {
        //look for pending preview in localstorage
        let init_params = {};
        const preview = JSON.parse(localStorage.getItem(STORAGEKEY_PENDING_PREVIEW) || '{}');
        if (preview.preview_id) {
            //restore pending preview and params
            init_params = preview.params;
            this.restorePendingPreview(preview);
            //restart polling
            this.startPolling(preview.preview_id)
        }
        this.resetParams(init_params);
    },

    methods: {
        request() {
            this.reset();
            const options = {
                width: this.getWindowWidthRange(),
                locale: this.$locale,
            };
            this.requestPreview(options)
                .then(preview_id => this.startPolling(preview_id), this.apiError);
        },
        startPolling(preview_id) {
            let interval = setInterval(() => {
                if (!this.currentPreviewFilesReceived && !this.currentPreviewExpired && !this.error) {
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
                userError = this.$trans('Api server fout. Probeer het later opnieuw.');
                if (console) {
                    console.error(error);
                }
            }
            this.setPreviewStatus('error');
            this.setError(userError);
        },
        getWindowWidthRange() {
            const {width,} = document.body.getBoundingClientRect();
            if (width > 1200) {
                return 1200;
            } else if (width > 800) {
                return 800;
            } else if (width > 640) {
                return 640;
            }
            return 400;
        },
        reset() {
            this.resetUi();
            this.resetPreview();
        },
        ...mapMutations({
            setError: SET_ERROR,
            setPreviewStatus: SET_PREVIEW_STATUS,
            resetUi: RESET_UI,
            resetPreview: RESET_PREVIEW,
        }),
        ...mapActions(['requestPreview', 'pollPreview', 'resetParams', 'restorePendingPreview',]),
    },
}
</script>
<style scoped>
    .animated-grid > div {
        transition: width 0.4s ease;
    }
    .button-fade-enter-active, .button-fade-leave-active {
        transition: opacity 0.6s ease;
    }
    .button-fade-enter, .button-fade-leave-to {
        opacity: 0;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.4s ease;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>