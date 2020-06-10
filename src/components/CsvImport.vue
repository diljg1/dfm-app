<template>
    <div>
        <button type="button" class="uk-button uk-button-default uk-button-small" @click="showModal">
            {{ 'CSV bestand importeren' | trans }}
        </button>
        <Modal ref="modal" :options="{stack: true,}">
            <div class="uk-modal-header">
                <h3>{{ 'CSV bestand importeren' | trans }}</h3>
            </div>
            <div class="uk-modal-body uk-form-horizontal">
                <div>
                    <label class="uk-form-label">{{ 'Selecteer bestand' | trans }}</label>
                    <div class="uk-form-controls">
                        <div class="uk-form-custom">
                            <input type="file" accept=".csv,.txt" @input="readCsv($event.target.files[0])">
                            <button type="button" class="uk-button uk-button-default" tabindex="-1">
                                {{ 'Selecteren' | trans }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="uk-margin">
                    <label for="skip-first-row" class="uk-form-label">{{ 'Eerste rij overslaan' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="skip-first-row" v-model="skipFirstRow" type="checkbox" class="uk-checkbox"/>
                    </div>
                </div>
                <template v-if="file && activeRows.length">
                    <div class="uk-margin uk-flex uk-flex-middle">
                        <strong class="uk-flex-1">{{ file.name }}</strong>
                        <small class="uk-margin-left">{{ activeRows[0].length }} {{ 'kolommen' | trans }}</small>
                        <small class="uk-margin-left">{{ activeRows.length }} {{ 'rijen' | trans }}</small>
                        <small class="uk-margin-left">{{ file.size | fileSize }}</small>
                    </div>
                    <div v-if="errors">
                        <p v-for="error in errors" :key="error.code" class="uk-alert uk-alert-warning">{{ error.message }}</p>
                    </div>
                    <p>
                        <em>{{ 'Selecteer de te importeren data door op de juiste kolom te klikken' | trans }}</em>
                    </p>
                    <div class="uk-margin-top">
                        <div class="uk-overflow-auto">
                            <table class="uk-table uk-table-small uk-table-divider uk-table-justify">
                                <thead>
                                <tr>
                                    <th class="uk-table-shrink">#</th>
                                    <th v-for="(val, colIndex) in activeRows[0]" :key="`th_${colIndex}`"
                                        :class="{'active-col': activeColIndex === colIndex,}"
                                        class="uk-text-nowrap cursor-pointer"
                                        @click="activeColIndex = colIndex">
                                        {{ 'kolom' | trans }} {{ colIndex + 1 }}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(row, rowIndex) in activeRows.slice(0, 5)" :key="`tr_${rowIndex}`">
                                    <td class="uk-table-shrink">{{ rowIndex + 1 }}</td>
                                    <td v-for="(val, colIndex) in row" :key="`td_${colIndex}`"
                                        :class="{'active-col': activeColIndex === colIndex,}"
                                        class="cursor-pointer"
                                        @click="activeColIndex = colIndex">
                                        <div style="max-width: 200px" class="uk-text-truncate">{{ val }}</div>
                                    </td>
                                </tr>
                                <tr v-if="activeRows.length > 5">
                                    <td :colspan="activeRows[0].length + 1">
                                        <small class="uk-text-italic">{{ moreRowsText }}</small>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <template>
                        <div v-if="activeColIndex !== null">
                            <label class="uk-form-label">{{ activeRows.length }} {{ 'items toevoegen' | trans }}</label>
                            <div class="uk-form-controls">
                                <template v-if="value.length">
                                    <label><input v-model="addMode" class="uk-radio" type="radio"
                                                  value="merge"> {{ 'Samenvoegen met bestaande items' | trans }}</label><br>
                                    <label><input v-model="addMode" class="uk-radio" type="radio"
                                                  value="replace"> {{ 'Bestaande items vervangen' | trans }}</label>
                                </template>
                            </div>
                        </div>
                        <div>

                        </div>
                    </template>
                </template>
            </div>
            <div class="uk-modal-footer uk-text-right">
                <button type="button" class="uk-button uk-button-default uk-modal-close">
                    {{ 'Sluiten' | trans }}
                </button>
                <button :disabled="!importData.length" type="button" class="uk-button uk-button-primary uk-margin-small-left"
                        @click="addItems">
                    {{ 'Importeren' | trans }}
                </button>
            </div>
        </Modal>
    </div>
</template>
<script>

import Modal from '@/components/Ui/Modal';
import Papa from 'papaparse';

export default {

    name: 'CsvImport',

    components: {
        Modal,
    },

    filters: {
        fileSize(size) {
            if (!size) {
                return '0';
            }
            let i = Math.floor( Math.log(size) / Math.log(1024) );
            return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB',][i];
        }
    },

    props: {
        value: Array,
    },

    data: () => ({
        file: null,
        addMode: 'merge',
        skipFirstRow: false,
        activeColIndex: null,
        errors: [],
        data: [],
    }),

    computed: {
        activeRows() {
            return this.skipFirstRow ? this.data.slice(1) : this.data;
        },
        moreRowsText() {
            return this.$trans('...en %count% meer rijen').replace('%count%', this.activeRows.length - 5);
        },
        importData() {
            if (this.activeColIndex === null) {
                return [];
            }
            let items = this.activeRows.map(r => r[this.activeColIndex]);
            if (this.addMode === 'merge') {
                items = [...this.value, ...items.filter(i => !this.value.includes(i)),];
            }
            items.sort();
            return items;
        },
    },

    methods: {
        showModal() {
            this.$refs.modal.show();
        },
        readCsv(file) {
            if (!file) {
                return;
            }
            this.file = file;
            Papa.parse(file, {
                skipEmptyLines: 'greedy',
                delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP,],
                complete: ({data, errors,}) => {
                    this.errors = errors.filter(e => !['Delimiter',].includes(e.type));
                    this.data = data;
                    this.activeColIndex = this.guessActiveCol(data);
                },
                error: (error) => {
                    this.$notify(this.$trans('Fout bij parsen CSV bestand', 'danger', 'warning'));
                    console.error("Parsing error:", error);
                },
            });
        },
        addItems() {
            this.$emit('input', this.importData);
            this.$refs.modal.hide();
        },
        guessActiveCol(data) {
            if (data[1]) {
                let firstString = null;
                let possibleSymbol = null;
                const symbolRegex = /[A-Z]{2,6}/;
                //check first data row for first column with a string
                for (let i = 0; i < data[1].length; i++) {
                    let val = data[1][i];
                    // noinspection EqualityComparisonWithCoercionJS
                    if (Number(val) != val) {
                        if (firstString === null) {
                            firstString = i;
                        }
                        if (val.match(symbolRegex)) {
                            possibleSymbol = i;
                            break;
                        }
                    }
                }
                return possibleSymbol !== null ? possibleSymbol : firstString;
            }
        },
    },
}
</script>
<style lang="less" scoped>
    th.active-col, td.active-col {
        background: #478580;
    }
</style>
