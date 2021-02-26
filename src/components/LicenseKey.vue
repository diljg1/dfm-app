<template>
    <div class="uk-flex uk-flex-middle">
        <div class="uk-flex-1">
            <span ref="icon"></span>
        </div>
        <div style="width: 90px" class="uk-text-right">
            <button :title="$trans('Licentiesleutel bewerken')"
                    :disabled="saving"
                    class="uk-button uk-button-default"
                    uk-tooltip="delay: 200"
                    @click="showModal">
                <span uk-icon="pencil"></span>
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
                        <p v-if="error" v-html="error" class="uk-alert uk-alert-danger uk-margin-small"></p>
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
            error: null,
            saving: false,
        }),

        computed: {
            licenseStatus() {
                if (this.isTrial) {
                    return 'trial';
                }
                if (this.noLicense) {
                    return 'no_license';
                }
                return 'valid';
            },
            licenseStatusText() {
                return {
                    'trial': `${this.$trans('Trialversie tot')} ${this.trialEndDate}`,
                    'no_license': this.$trans('Geen geldige licentie!'),
                    'valid': this.$trans('Licentie actief'),
                }[this.licenseStatus];
            },
            iconParams() {
                return {
                    'trial': {icon: 'future',},
                    'no_license': {icon: 'warning',},
                    'valid': {icon: 'check',},
                }[this.licenseStatus];
            },
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
                noLicense: state => state.user.noLicense,
                isTrial: state => state.user.isTrial,
                trialEnd: state => state.user.trialEnd,
            }),
            ...mapGetters(['userField',]),
        },

        created() {
            this.$bus.$on('modal:license_key', this.showModal);
        },

        mounted() {
            this.$watch('licenseStatusText', title => UIkit.tooltip(this.$refs.icon, {title, delay: 200,}), {immediate: true,});
            this.$watch('iconParams', params => UIkit.icon(this.$refs.icon, {ratio: 1.1, ...params,}), {immediate: true,});
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
                    this.error = null;
                    this.saving = true;
                    const success = await this.updateUserField({field_name: 'license_key', value: this.licenseKey,});
                    if (success) {
                        this.$notify(this.$trans('Licentiesleutel opgeslagen'), 'success', 'check');
                        this.$refs.modal.hide();
                    } else {
                        this.$notify(this.$trans('Fout bij opslaan licentiesleutel'), 'danger', 'warning');
                    }
                } catch ({error, status,}) {
                    if (status === 422) {
                        this.error = error;
                    } else {
                        console.error(status, error);
                        this.$notify(this.$trans('Fout bij opslaan licentiesleutel'), 'danger', 'warning');
                    }
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
