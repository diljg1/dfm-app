<template>
    <div>
        <div class="uk-search uk-search-default">
            <input ref="input"
                   :value="value"
                   :placeholder="placeholderText"
                   class="uk-input"
                   type="text"
                   @input="input($event.target.value)"
                   @keyup.enter="pick({symbol: $event.target.value,})">

            <a v-show="value !== '' && !spinning" class="uk-position-top-right"
               style="top: 12px; right: 7px"
               uk-close
               @click="input('')"></a>

            <div v-show="spinning" class="uk-position-top-right"
                 style="top: 12px; right: 7px"
                 uk-spinner="ratio: 0.6"></div>
        </div>
        <div ref="dropdown" class="uk-dropdown uk-padding-small">
            <ul class="uk-nav uk-dropdown-nav">
                <li v-if="value && !spinning && !acList.length">
                    <a>{{ 'Geen resultaten' | trans('ui.search.ac.no_results') }}</a>
                </li>
                <!-- eslint-disable-next-line vue/require-v-for-key-->
                <li v-for="option in acList">
                    <a class="uk-flex uk-flex-middle" @click="pick(option)">
                        <strong style="width: 80px">{{ option.symbol }}</strong>
                        <span class="uk-flex-1 uk-margin-small-left">{{ option.name }}</span>
                        <small class="uk-margin-small-left">{{ option.typeDisp }} -{{ option.exch }}</small>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import UIkit from 'uikit';
import debounce from 'lodash/debounce';
import {apiRequest,} from '@/lib/util';

export default {

    name: 'SymbolSearch',

    props: {
        value: {type: String, default: '',},
        boundary: {type: String, default: '',},
        placeholder: {type: String, default: '',},
    },

    data: () => ({
        spinning: false,
        acList: [],
        dropdown: null,
    }),

    computed: {
        placeholderText() {
            return this.placeholder || this.$trans('Symbols...', 'general.form.placeholder.search');
        },
        dropDownOptions() {
            return {
                pos: 'bottom-justify',
                toggle: false,
                boundary: this.boundary,
                boundaryAlign: true,
                animation: 'uk-animation-slide-top-small',
                duration: 200,
            };
        },
    },

    watch: {
        'value': debounce(async function(search) {
            if (search) {
                try {
                    this.spinning = true;
                    const {ResultSet,} = await apiRequest('searchSymbol', {search,});
                    if (ResultSet.Query === this.value) { //ignore late returns
                        this.acList = ResultSet.Result;
                    }
                } catch (err) {
                    console.error(err);
                    this.$notify(this.$trans('Fout bij zoeken symbolen'), 'danger', 'warning');
                } finally {
                    this.spinning = false;
                }
            } else {
                this.acList = [];
            }
        }, 300),
    },

    mounted() {
        this.dropdown = UIkit.dropdown(this.$refs.dropdown, this.dropDownOptions);
    },

    methods: {
        focus() {
            this.$refs.input.focus();
        },
        input(value) {
            if (this.dropdown) {
                this.spinning = !!value;
                this.dropdown[value ? 'show' : 'hide'](false);
            }
            this.$emit('input', value);
        },
        pick({symbol,}) {
            this.dropdown.hide(true);
            this.$emit('input', symbol);
            this.$emit('pick', symbol);
        },
    },

};

</script>
<style lang="less" scoped>
    .uk-nav li > a {
        display: flex;
    }
</style>
