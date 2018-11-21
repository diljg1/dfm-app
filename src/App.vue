<template>
    <div id="app">
        <div class="uk-section uk-section-default uk-margin-top">
            <h1>{{ 'Probeer DigiFundManager Online' | trans }}</h1>
            <div class="uk-container">
                <div class="uk-grid animated-grid">
                    <div :class="gridClasses.firstCol">
                        <transition name="fade" mode="out-in">
                            <div v-if="mode === 'form'" key="form" class="uk-margin">

                                <p v-html="$trans('form_introtext')"></p>

                                <ParamsForm class="uk-margin"></ParamsForm>

                            </div>
                            <div v-if="mode === 'display'" key="display" class="uk-margin">

                                <h3>{{ 'Uw parameters' | trans }}</h3>

                                <ParamsDisplay class="uk-margin"></ParamsDisplay>

                            </div>
                        </transition>

                    </div>
                    <div :class="gridClasses.secondCol" class="uk-flex uk-flex-column">

                        <ErrorMessage></ErrorMessage>

                        <div class="uk-flex uk-flex-center uk-flex-middle uk-margin-bottom">
                            <div v-if="isSpinning" class="uk-margin-right" uk-spinner></div>
                            <div v-else-if="!currentPreviewFilesReceived">
                                <button type="button"
                                        @click="request"
                                        class="uk-button uk-button-primary uk-width-1-1@l">
                                    <span uk-icon="check"></span>
                                    {{ 'Nu Berekenen' | trans }}
                                </button>
                                <button type="button"
                                        @click="resetParams"
                                        class="uk-button uk-dark uk-button-small uk-width-1-1@l uk-margin-small-top">
                                    {{ 'Standaardwaarden' | trans }}
                                </button>
                            </div>
                            <div v-if="isSpinning || currentPreviewFilesReceived">
                                <button type="button"
                                        @click="reset"
                                        class="uk-button uk-dark">
                                    {{ 'Opnieuw' | trans }}
                                </button>
                            </div>
                        </div>
                        <transition name="fade" mode="out-in">
                            <div v-if="!currentPreviewFilesReceived"
                                 key="pending" class="uk-flex-1">

                                <Pending class="uk-card uk-card-body uk-card-default"></Pending>
                                <MessageScroll v-if="isSpinning" class="uk-margin"
                                               :max-height="150"
                                               :interval="messageScrollInterval"
                                               :autoplay="true"></MessageScroll>
                            </div>
                            <div v-if="currentPreviewFilesReceived"
                                 key="results" class="uk-card uk-card-body uk-card-default uk-flex-1">
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
import {POLLING_INTERVAL, STORAGEKEY_PENDING_PREVIEW, MESSAGESCROLL_INTERVAL,} from '../config';

export default {

    name: 'App',

    data: () => ({
        interval: null,
        messageScrollInterval: MESSAGESCROLL_INTERVAL,
    }),

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
            'isSpinning', 'getParamsFromRequest',
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
        let init_params = this.getParamsFromRequest;
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
                .then(preview_id => this.startPolling(preview_id), res => this.apiError(res));
        },
        startPolling(preview_id) {
            //try for quick responses
            setTimeout(() => {
                this.pollPreview(preview_id)
                    .catch(res => this.apiError(res));
            }, 2000);
            this.interval = setInterval(() => {
                if (!this.currentPreviewFilesReceived && !this.currentPreviewExpired && !this.error) {
                    this.pollPreview(preview_id)
                        .catch(res => this.apiError(res));
                } else {
                    clearInterval(this.interval);
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
            if (this.interval) {
                clearInterval(this.interval);
            }
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
<style lang="less">
    .uk-form-label {font-size: 14px}

</style>
<style lang="less" scoped>
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