<template>
    <div>
        <div class="uk-overflow-auto">
            <div v-if="currentRebalancing" class="uk-flex uk-flex-middle uk-flex-wrap uk-text-small">
                <label class="uk-flex-1">{{ 'Current rebalancing' | trans }}</label>
                <div class="uk-text-bold">{{ currentRebalancing.toLocaleDateString() }}</div>
            </div>
            <div v-if="nextRebalancing" class="uk-flex uk-flex-middle uk-flex-wrap uk-text-small">
                <label class="uk-flex-1">{{ 'Next rebalancing' | trans }}</label>
                <div class="uk-text-bold">{{ nextRebalancing.toLocaleDateString() }}</div>
            </div>
            <div class="uk-flex uk-flex-middle uk-flex-wrap uk-text-small">
                <label class="uk-flex-1">{{ 'Investment objective' | trans }}</label>
                <div class="uk-text-bold">{{ investmentObjective }}</div>
            </div>
            <div class="uk-child-width-1-2@l uk-grid-small uk-text-small uk-margin-small-top" uk-grid>
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
            </div>
            <table class="uk-margin-remove uk-table uk-table-divider uk-table-small uk-table-justify">
                <thead>
                <tr>
                    <th>
                        {{ 'Symbol' | trans }}<br />
                        <input v-model="config.filter.search" type="text"
                               class="uk-input uk-form-small uk-form-width-small"
                               style="font-size: 14px" />
                    </th>
                    <th v-for="(field, index) in activeFields" :key="`${index}${field}`">{{ field | trans }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, index) in paginatedRows" :key="`row_${index}`">
                    <td class="uk-text-left">{{ row[symbolFieldName] }}</td>
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

    import Pagination from '@/components/Ui/Pagination.vue';

    const FIELD_SYMBOL = 'symbol';
    const FIELD_SETS = {
        nr: ['nr_equ', 'nr_pr', 'nr_opt',],
        ratio: ['ratio_equ', 'ratio_pr', 'ratio_opt',],
    };
    const DATA_INDEX = 6;
    const FILE_COLUMNS = {
        'monday_trades_equ_w.csv': {'symbol': 0, 'ratio_equ': 1, 'nr_equ': 2,},
        'monday_trades_pr_w.csv': {'symbol': 0, 'ratio_pr': 1, 'nr_pr': 2,},
        'monday_trades_opt_w.csv': {'symbol': 0, 'ratio_opt': 1, 'nr_opt': 2,},
    };

    export default {

        name: 'StockTable',

        components: {
            Pagination,
        },

        props: {
            files: Array,
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
            investmentObjective: null,
            currentRebalancing: null,
            nextRebalancing: null,
        }),

        computed: {
            symbolFieldName() {
                return FIELD_SYMBOL;
            },
            activeFields() {
                return FIELD_SETS[this.fieldSet];
            },
            filteredRows() {
                return this.data.filter(row => {
                    return (!this.config.filter.search ||
                        row[this.symbolFieldName].toLowerCase().includes(this.config.filter.search.toLowerCase()));
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
                //get meta from first file
                const [metafile,] = this.files;
                this.setMeta(metafile);
                const bySymbol = {};
                this.files.forEach(({name, data,}) => {
                    const fileIndices = FILE_COLUMNS[name];
                    data.slice(DATA_INDEX).forEach(row => {
                        const symbol = row[fileIndices.symbol];
                        const data = {};
                        Object.entries(fileIndices).forEach(([key, index,]) => data[key] = row[index]);
                        bySymbol[symbol] = {
                            ...(bySymbol[symbol] || {}),
                            ...data,
                        };
                    });
                });
                this.data = Object.values(bySymbol);
            },
            setMeta(metafile) {
                const current_rebalancing = metafile.data[1][1];
                const next_rebalancing = metafile.data[3][1];
                const investment_objective = metafile.data[4][1];
                this.currentRebalancing = this.getDate(current_rebalancing);
                this.nextRebalancing = this.getDate(next_rebalancing);
                this.investmentObjective = this.$trans(investment_objective);
            },
            setPage(page) {
                this.config.page = page;
            },
            getDate(string) {
                if (!string) {
                    return null;
                }
                const date = new Date();
                date.setFullYear(string.substring(0, 4), string.substring(4, 6), string.substring(6, 8))
                return date;
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
