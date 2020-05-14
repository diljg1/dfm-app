<template>
    <div>
        <div class="uk-text-center uk-margin-small-top">
            <small v-if="isTrial" key="trial" class="uk-flex uk-flex-middle uk-flex-center">
                <em>{{ 'Trialversie tot' | trans }} {{ trialEndDate }}</em>
            </small>
            <small v-else-if="noLicense" key="expired" class="uk-text-warning uk-flex uk-flex-middle uk-flex-center">
                <em>
                    <span uk-icon="icon:warning;ratio:0.7" class="uk-margin-small-right"></span>
                    {{ 'Geen licentie!' | trans }}
                </em>
            </small>
            <small v-else-if="hasLicense" key="license" class="uk-flex uk-flex-middle uk-flex-center">
                <em>
                    <span uk-icon="icon:check;ratio:0.7" class="uk-margin-small-right"></span>
                    {{ 'Licentie actief' | trans }}
                </em>
            </small>
        </div>
        <div class="uk-text-right">
            <button :disabled="saving" type="button" class="uk-button uk-button-link uk-button-small" @click="showModal">
                {{ 'Licentiesleutel invoeren' | trans }}
            </button>
        </div>
        <Modal ref="modal">
            <div class="uk-modal-header">
                <h3>{{ 'Licentiesleutel Digifundmanager' | trans }}</h3>
            </div>
            <div class="uk-modal-body uk-form-horizontal">
                <div>
                    <label for="licenseKey" class="uk-form-label">{{ 'Licentiesleutel' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="licenseKey" v-model="licenseKey" type="text" class="uk-input" />
                    </div>
                </div>
            </div>
            <div class="uk-modal-footer uk-text-right">
                <button type="button" class="uk-button uk-button-default uk-modal-close">
                    {{ 'Sluiten' | trans }}
                </button>
                <button :disabled="saving" type="button" class="uk-button uk-button-primary uk-margin-small-left" @click="save">
                    {{ 'Opslaan' | trans }}
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex';

    import Modal from '@/components/Ui/Modal';
    import {SET_USERFIELD} from '@/store/mutation-types';

    export default {

        name: 'LicenseKey',

        components: {
            Modal,
        },

        data: () => ({
            saving: false,
        }),

        computed: {
            licenseKey: {
                get() {
                    return this.userField('license_key');
                },
                set(value) {
                    this.$store.commit(SET_USERFIELD, {field_name: 'license_key', value,});
                },
            },
            trialEndDate() {
                return this.trialEnd ? new Date(this.trialEnd).toLocaleDateString() : '';
            },
            ...mapState({
                hasLicense: state => !state.user.noLicense && !state.user.noLicense,
                noLicense: state => state.user.noLicense,
                isTrial: state => state.user.isTrial,
                trialEnd: state => state.user.trialEnd,
            }),
            ...mapGetters(['userField',]),
        },

        created() {
            this.$bus.$on('modal:license_key', this.showModal);
        },

        beforeDestroy() {
            this.$bus.$off('modal:license_key', this.showModal);
        },

        methods: {
            showModal() {
                this.$refs.modal.show();
            },
            async save() {
                try {
                    this.saving = true;
                    const success = await this.updateUserField({field_name: 'license_key', value: this.licenseKey,});
                    if (success) {
                        this.$notify(this.$trans('Licentiesleutel opgeslagen'), 'success', 'check');
                    } else {
                        this.$notify(this.$trans('Fout bij opslaan licentiesleutel', 'danger', 'warning'));
                    }
                } catch ({error, status,}) {
                    console.error(status, error);
                    this.$notify(this.$trans('Fout bij opslaan licentiesleutel', 'danger', 'warning'));
                } finally {
                    this.saving = false;
                }
            },
            ...mapActions(['updateUserField',]),
        },
    }
</script>

<style scoped>

</style>
