<template>
    <div>
        <div class="uk-text-center uk-margin-small-top">
            <small v-if="csiActive" key="active" class="uk-flex uk-flex-middle uk-flex-center">
                <em><span uk-icon="icon:check;ratio:0.7" class="uk-margin-small-right"></span>
                {{ 'CSI abonnement actief' | trans }}</em>
            </small>
            <small v-else-if="isTrial" key="trial" class="uk-flex uk-flex-middle uk-flex-center">
                <em><span uk-icon="icon:check;ratio:0.7" class="uk-margin-small-right"></span>
                {{ 'CSI abonnement is inbegrepen in trial' | trans }}</em>
            </small>
            <small v-else key="inactive" class="uk-flex uk-flex-middle uk-flex-center">
                <em><span uk-icon="icon:warning;ratio:0.7" class="uk-margin-small-right"></span>
                    {{ 'CSI abonnement niet actief' | trans }}</em>
            </small>
        </div>
        <div class="uk-text-right">
            <button :disabled="saving" type="button" class="uk-button uk-button-link uk-button-small" @click="showModal">
                {{ 'E-mailadres invoeren' | trans }}
            </button>
        </div>
        <Modal ref="modal">
            <div class="uk-modal-header">
                <h3>{{ 'E-mailadres  CSI' | trans }}</h3>
            </div>
            <div class="uk-modal-body uk-form-horizontal">
                <div>
                    <label for="csiEmail" class="uk-form-label">{{ 'E-mailadres voor CSI abonnement' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="csiEmail" v-model="csiEmail" type="text" class="uk-input" />
                        <p v-if="error" class="uk-alert uk-alert-danger" v-text="error"></p>
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

        name: 'CsiEmail',

        components: {
            Modal,
        },

        data: () => ({
            saving: false,
            error: null,
        }),

        computed: {
            csiEmail: {
                get() {
                    return this.userField('csi_email');
                },
                set(value) {
                    this.$store.commit(SET_USERFIELD, {field_name: 'csi_email', value,});
                },
            },
            ...mapState({
                isTrial: state => state.user.isTrial,
                csiActive: state => state.user.csiActive,
            }),
            ...mapGetters(['userField',]),
        },

        created() {
            this.$bus.$on('modal:csi_email', this.showModal);
        },

        beforeDestroy() {
            this.$bus.$off('modal:csi_email', this.showModal);
        },

        methods: {
            showModal() {
                this.$refs.modal.show();
            },
            async save() {
                this.error = null;
                this.saving = true;
                try {
                    const success = await this.updateUserField({field_name: 'csi_email', value: this.csiEmail,});
                    if (success) {
                        this.$notify(this.$trans('E-mailadres opgeslagen'), 'success', 'check');
                        this.$refs.modal.hide();
                    } else {
                        this.error = this.$trans('Fout bij opslaan e-mailadres');
                    }
                } catch ({error, status,}) {
                    this.error = this.$trans(error || 'Fout bij opslaan e-mailadres', 'danger', 'warning');
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
