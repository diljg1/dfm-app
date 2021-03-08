<template>
    <div id="app">
        <div class="uk-section uk-section-default">
            <div class="uk-container">
                <div id="dfm-top" class="uk-card uk-card-secondary uk-padding-small"
                     style="border-top: none"
                     uk-sticky="offset:96;media: @m">
                    <div class="uk-child-width-1-3@m" uk-grid>
                        <div>
                            <h4 class="uk-margin-small-bottom">{{ 'Watchlist' | trans }}</h4>
                            <Watchlists />
                        </div>
                        <div>
                            <h4 class="uk-margin-small-bottom">{{ 'Gameplan' | trans }}</h4>
                            <GameplanPresets />
                        </div>
                        <div>
                            <div class="uk-flex uk-flex-middle">
                                <div>
                                    <h4 class="uk-margin-small-bottom">{{ 'Licentie' | trans }}</h4>
                                    <LicenseKey />
                                </div>
                                <div class="uk-flex-1 uk-margin-small-left">
                                    <ErrorMessage></ErrorMessage>
                                    <template v-if="!isSpinning && !currentPreviewFilesReceived">
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
                                    </template>
                                    <template v-else>
                                        <div class="uk-flex uk-flex-middle">
                                            <div v-if="isSpinning" class="uk-margin-right" uk-spinner></div>
                                            <div class="uk-flex-1 uk-text-right">
                                                <button type="button"
                                                        @click="reset"
                                                        class="uk-button uk-dark">
                                                    {{ 'Opnieuw' | trans }}
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <NoLicense />
                <div class="uk-grid-divider uk-margin-top" uk-grid>
                    <div class="uk-width-3-4@m">
                        <transition name="fade" mode="out-in">
                            <div v-if="mode === 'form'" key="form" class="uk-margin">

                                <p v-if="showIntro" v-html="$trans('form_introtext')"></p>

                                <ParamsForm ref="paramsForm" class="uk-margin"></ParamsForm>

                            </div>
                            <div v-if="mode === 'display'" key="display" class="uk-margin">
                                <transition name="fade" mode="out-in">
                                    <div v-if="!currentPreviewFilesReceived"
                                         key="pending" class="uk-flex-1">

                                        <Pending v-if="currentPreviewStatus" class="uk-card uk-card-body uk-card-default"></Pending>
                                        <MessageScroll v-if="isSpinning" class="uk-margin"
                                                       :max-height="150"
                                                       :interval="messageScrollInterval"
                                                       :autoplay="true"></MessageScroll>
                                    </div>
                                    <div v-if="currentPreviewFilesReceived"
                                         key="results" class="uk-card uk-card-body uk-flex-1">
                                        <Preview :preview-request="currentPreview"></Preview>
                                    </div>
                                </transition>
                            </div>
                        </transition>
                    </div>
                    <div class="uk-width-1-4@m uk-flex-first@m">
                        <h3>{{ 'Uw parameters' | trans }}</h3>

                        <ParamsDisplay :link-titles="mode === 'form'"
                                       class="uk-margin"
                                       @accordion:show="showAccordion"></ParamsDisplay>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

import {RESET_PREVIEW, RESET_UI, SET_ERROR, SET_PREVIEW_STATUS} from '@/store/mutation-types';
import {MESSAGESCROLL_INTERVAL, POLLING_INTERVAL, STORAGEKEY_PENDING_PREVIEW} from '@/../config';
import NoLicense from '@/NoLicense';

export default {

    name: 'App',

    components: {NoLicense,},

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
        ...mapState({
            currentPreview: state => state.preview,
            error: state => state.error,
            showTitle: state => state.showTitle,
            showIntro: state => state.showIntro,
            params: state => state.params.params,
            gameplans: state => state.gameplans,
            ownWatchlistId: state => state.watchlists.ownWatchlistId,
            isTrial: state => state.user.isTrial,
            noLicense: state => state.user.noLicense,
        }),
        ...mapState({
            links: state => state.links,
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
        const params = new URLSearchParams(window.location.search);
        let init_params = {};
        if (params.has('gameplan') && this.gameplans[params.get('gameplan')]) {
            init_params = this.gameplans[params.get('gameplan')];
        }
        const preview = JSON.parse(localStorage.getItem(STORAGEKEY_PENDING_PREVIEW) || '{}');
        if (preview.preview_id) {
            //restore pending preview and params
            init_params = preview.params;
            this.restorePendingPreview(preview);
            //restart polling
            this.startPolling(preview.preview_id)
        }
        this.resetParams(init_params);
        //autosend if wanted
        if (params.has('s') && params.get('s') === '1') {
            setTimeout(() => this.request(), 1500);
        }
    },

    methods: {
        showAccordion(index) {
            if (this.$refs.paramsForm) {
                this.$refs.paramsForm.showAccordion(index)
            }
        },
        request() {
            this.reset();
            const options = {
                width: this.getWindowWidthRange(),
                locale: this.$locale,
                ownWatchlistId: this.ownWatchlistId,
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
    @import '~uikit/src/less/components/variables';

    .uk-select:not([multiple]):not([size]) option {color: @global-inverse-color !important;}
    .uk-form-label {font-size: 14px}
    .uk-tooltip {color: @global-inverse-color !important;}

    .dfm-accordion {
        .uk-accordion-title {
            background: #14344d;
            padding: @global-small-margin;
        }
        .uk-open .uk-accordion-title {
            background: #05233a;
        }
    }
    .dfm-dropdown-scroll {
        max-height: calc(100vh - 200px);
        overflow-y: auto;
    }
    .dfm-dropdown-scroll::-webkit-scrollbar {
        width: 0.5rem;
        height: 0.5rem;
    }
    .dfm-dropdown-scroll::-webkit-scrollbar-track {
        background-color: #05233a;
    }
    .dfm-dropdown-scroll::-webkit-scrollbar-thumb {
        background-color: #478580;
    }

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
