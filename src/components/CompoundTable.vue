<template>
    <div>
        <table class="uk-table uk-table-divider uk-table-small">
            <thead>
            <tr>
                <th>
                    {{ 'Compounded investment' | trans }}
                </th>
                <th>
                    <label for="equ_w_f">{{ 'Equ.W (F)' | trans }}</label>
                </th>
                <th>
                    <label for="s_p_500">{{ 'S&P500' | trans }}</label>
                </th>
                <th>
                    <label for="random_500_f">{{ 'Random500 (F)' | trans }}</label>
                </th>
                <th>
                    <label for="equ_w_m">{{ 'Equ.W (M)' | trans }}</label>
                </th>
                <th>
                    <label for="pr_w_asp_m">{{ 'PR(W[ASP] (M)' | trans }}</label>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td class="uk-text-bold">{{ 'Show' | trans }}</td>
                <td class="uk-text-center">
                    <input v-model="filter"
                           id="equ_w_f" value="equ_w_f"
                           type="checkbox" class="uk-checkbox" />
                </td>
                <td class="uk-text-center">
                    <input v-model="filter"
                           id="s_p_500" value="s_p_500"
                           type="checkbox" class="uk-checkbox" />
                </td>
                <td class="uk-text-center">
                    <input v-model="filter"
                           id="random_500_f" value="random_500_f"
                           type="checkbox" class="uk-checkbox" />
                </td>
                <td class="uk-text-center">
                    <input v-model="filter"
                           id="equ_w_m" value="equ_w_m"
                           type="checkbox" class="uk-checkbox" />
                </td>
                <td class="uk-text-center">
                    <input v-model="filter"
                           id="pr_w_asp_m" value="pr_w_asp_m"
                           type="checkbox" class="uk-checkbox" />
                </td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Reward/risk ratio (MAR)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(10, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(10, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(10, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(10, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(10, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'CAGR' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(11, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(11, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(11, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(11, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(11, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'MDD (Maximum drawdown)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(12, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(12, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(12, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(12, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(12, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'YTD (Year-To-Date)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(13, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(13, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(13, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(13, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(13, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'PWR (Portfolio win ratio)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(14, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(14, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(14, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(14, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(14, 5) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import get from 'lodash/get';

export default {

    name: 'CompoundTable',

    props: {
        mainTableData: Array,
        value: Array,
    },

    computed: {
        filter: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },

    methods: {
        fieldValue(row, index) {
            return get(this.mainTableData, `${row}.${index}`, '');
        },
    },
};

</script>
<style lang="less" scoped>
    table.uk-table-divider {
        td, th {
            border-right: 1px solid rgba(255,255,255,.1);
        }
        tbody tr:last-child {
            border-bottom: 1px solid rgba(255,255,255,.1);
        }
    }
</style>
