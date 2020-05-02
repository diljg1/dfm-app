<template>
    <div>
        <div class="uk-overflow-auto">
            <div class="uk-child-width-1-3@l uk-grid-small uk-text-small" uk-grid>
                <div>
                    <label>
                        <input v-model="fieldSet" type="radio" class="uk-radio" value="A"/>
                        {{ 'Ratio' | trans }}
                    </label>
                </div>
                <div>
                    <label>
                        <input v-model="fieldSet" type="radio" class="uk-radio" value="B"/>
                        {{ 'Nr of shares' | trans }}
                    </label>
                </div>
                <div>
                    <label>
                        <input v-model="fieldSet" type="radio" class="uk-radio" value="C"/>
                        {{ 'Amount' | trans }}
                    </label>
                </div>
            </div>
            <table class="uk-margin-small-top uk-table uk-table-divider uk-table-small uk-table-justify">
                <thead>
                <tr>
                    <th>
                        {{ 'Symbol' | trans }}
                        <input v-model="config.filter.search" type="text" class="uk-input uk-form-small" />
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
                    <td :colspan="fields.length">
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

    import Pagination from '@/components/Pagination';

    const FIELD_SYMBOL = 'head 1';
    const FIELD_SETS = {
        A: ['head 2', 'head 3', 'head 4',],
        B: ['head 5', 'head 6', 'head 7',],
        C: ['head 8', 'head 9', 'head 10',],
    };

    export default {

        name: 'StockTable',

        components: {
            Pagination,
        },

        props: {
            data: Array,
            fields: Array,
        },

        data: () => ({
            fieldSet: 'A',
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
                    return (!this.config.filter.search || row[this.symbolFieldName].includes(this.config.filter.search));
                });
            },
            paginatedRows() {
                const start = (this.config.page - 1) * this.config.limit;
                return this.filteredRows.slice(start, start + this.config.limit);
            },
            pagination() {
                return {
                    current_page: this.config.page,
                    last_page: Math.ceil(this.data.length / this.config.limit),
                    total: this.data.length,
                };
            },
        },

        methods: {
            setPage(page) {
                this.config.page = page;
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
