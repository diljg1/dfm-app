<template>
    <div>
        <div class="uk-overflow-auto">
            <div v-if="currentRebalancing" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ 'Current rebalancing' | trans }}</label>
                <div class="uk-text-bold">{{ currentRebalancing.toLocaleDateString() }}</div>
            </div>
            <div v-if="nextRebalancing" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ 'Next rebalancing' | trans }}</label>
                <div class="uk-text-bold">{{ nextRebalancing.toLocaleDateString() }}</div>
            </div>
            <div class="uk-child-width-1-3@l uk-grid-small uk-margin-small-top" uk-grid>
                <div>
                    <label>
                        <input v-model="fieldSet" type="radio" class="uk-radio uk-margin-small-right" value="nr"/>
                        {{ 'Nr of shares' | trans }}
                    </label>
                </div>
                <div>
                    <label>
                        <input v-model="fieldSet" type="radio" class="uk-radio uk-margin-small-right" value="ratio"/>
                        {{ 'Ratio' | trans }}
                    </label>
                </div>
                <div class="uk-text-right">
                    <button type="button"
                            class="uk-button uk-button-default uk-button-small"
                            @click="exportCsv">
                        {{ 'Export to CSV file' | trans }}
                    </button>
                </div>
            </div>
            <table class="uk-margin-remove uk-table uk-table-divider uk-table-small uk-table-justify">
                <thead>
                <tr>
                    <th class="uk-width-2-5">
                        {{ 'Symbol' | trans }}<br />
                        <input v-model="config.filter.search" type="text"
                               class="uk-input uk-form-small uk-form-width-small"
                               style="font-size: 14px" />
                    </th>
                    <th v-for="(field, index) in activeFields"
                        :key="`${index}${field}`" class="uk-width-1-5">{{ field | trans }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, index) in paginatedRows" :key="`row_${index}`">
                    <td class="uk-text-left">{{ row.symbol }}</td>
                    <td v-for="(field, index) in activeFields" :key="`data_${field}_${index}`">{{ row[field] }}</td>
                </tr>
                <tr v-if="config.filter.search && !paginatedRows.length">
                    <td :colspan="activeFields.length + 1">
                        {{ 'Geen resultaten' | trans }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <Pagination :pagination="pagination"
                       @pagination:nav="setPage" />
    </div>
</template>
<script>

import Papa from 'papaparse';
import {downloadBlob,} from '@/lib/util';
import Pagination from '@/components/Ui/Pagination.vue';

const FIELD_SETS = {
    nr: ['nr_equ', 'nr_pr', 'nr_opt',],
    ratio: ['ratio_equ', 'ratio_pr', 'ratio_opt',],
};
const DATA_INDEX = 5;
const FILE_COLUMNS = {'symbol': 0, 'ratio_equ': 1, 'nr_equ': 2, 'ratio_pr': 3, 'nr_pr': 4, 'ratio_opt': 5, 'nr_opt': 6,};

export default {

    name: 'StockTable',

    components: {
        Pagination,
    },

    props: {
        stockTableData: Array,
    },

    data: () => ({
        fieldSet: 'nr',
        config: {
            filter: {
                search: '',
                fields: [],
            },
            ordering: {
                order_by: '',
                dir: 'asc',
            },
            page: 1,
            limit: 15,
        },
        data: [],
    }),

    computed: {
        currentRebalancing() {
            const [, dateString,] = this.stockTableData[1][0].split(':')
            return this.getDate(dateString);
        },
        nextRebalancing() {
            const [, dateString,] = this.stockTableData[2][0].split(':')
            return this.getDate(dateString);
        },
        activeFields() {
            return FIELD_SETS[this.fieldSet];
        },
        filteredRows() {
            return this.data.filter(row => {
                return (!this.config.filter.search ||
                    row.symbol.toLowerCase().includes(this.config.filter.search.toLowerCase()));
            });
        },
        paginatedRows() {
            const start = (this.config.page - 1) * this.config.limit;
            return this.filteredRows.slice(start, start + this.config.limit);
        },
        pagination() {
            return {
                current_page: this.config.page,
                last_page: Math.ceil(this.filteredRows.length / this.config.limit),
                total: this.filteredRows.length,
            };
        },
    },

    created() {
        this.setData();
    },

    methods: {
        setData() {
            const bySymbol = {};
            this.stockTableData.slice(DATA_INDEX).forEach(row => {
                const data = {};
                Object.entries(FILE_COLUMNS).forEach(([key, index,]) => data[key] = row[index]);
                if (data.symbol) {
                    bySymbol[data.symbol] = data;
                }
            });
            this.data = Object.values(bySymbol);
        },
        setPage(page) {
            this.config.page = page;
        },
        getDate(string) {
            if (!string) {
                return null;
            }
            try {
                return new Date(string);
            } catch (e) {
                return null;
            }
        },
        exportCsv() {
            const csv = Papa.unparse(this.data, {
                columns: ['symbol', ...this.activeFields,],
            });
            const filename = `Monday-trades-${this.fieldSet}.csv`;
            downloadBlob(new Blob([csv,]), filename);
        },
    },
};
</script>
<style scoped>
    .uk-table-small td {
        padding-top: 5px;
        padding-bottom: 5px;
    }
</style>
