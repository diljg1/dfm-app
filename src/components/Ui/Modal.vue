<template>
    <div :class="classes" class="uk-modal">
        <div :class="dialogClasses" class="uk-modal-dialog">
            <button v-if="closeButton" :class="closeClasses" type="button" uk-close></button>
            <template v-if="opened">
                <slot></slot>
            </template>
        </div>
    </div>
</template>

<script>
import UIkit from 'uikit';
import {focusInput, onOwnEvent,} from '@/lib/util';

export default {

    name: 'Modal',

    props: {
        closeButton: {type: Boolean, default: true,},
        container: {type: Boolean, default: false,},
        full: {type: Boolean, default: false,},
        center: {type: Boolean, default: false,},
        downOnOpen: {type: Boolean, default: false,},
        dialogClass: {type: String, default: '',},
        options: {
            type: Object, default: () => ({}),
        },
    },

    data: () => ({
        opened: false,
    }),

    computed: {

        classes() {
            return {
                'uk-modal-container': this.container,
                'uk-modal-full': this.full,
                'uk-flex-top': this.center,
            };
        },
        dialogClasses() {
            const classes = this.dialogClass ? [this.dialogClass,] : [];
            if (this.center) {
                classes.push('uk-margin-auto-vertical');
            }
            return classes;
        },
        closeClasses() {
            return this.full ? 'uk-modal-close-full uk-close-large' : 'uk-modal-close-default';
        },

    },

    mounted() {

        const options = this.options;
        //move to bottom of body
        if (this.downOnOpen) {
            this.moveToDomBottom();
        }

        this.modal = UIkit.modal(this.$el, {...{stack: true,}, ...options,});
        onOwnEvent(this.$el, 'beforeshow', () => {
            this.opened = true;
        });
        onOwnEvent(this.$el, 'shown', () => {
            this.$nextTick(() => focusInput(this.$el));
            this.$emit('opened');
        });
        onOwnEvent(this.$el, 'beforehide', () => {
            this.$emit('closing');
        });
        onOwnEvent(this.$el, 'hidden', () => {
            this.opened = false;
            this.$emit('closed');
        });

    },

    beforeDestroy() {
        if (this.downOnOpen) {
            document.body.removeChild(this.$el);
        }
    },

    methods: {
        show() {
            if (this.downOnOpen) {
                this.moveToDomBottom();
            }
            this.modal.show();
        },

        //move to bottom of dom, so on top of the view
        moveToDomBottom() {
            //be careful with manipulating DOM outside Vue, it appears to be messing with Vues reactivity
            document.body.appendChild(this.$el);
        },

        hide() {
            this.modal.hide();
        },

    },

};

</script>
