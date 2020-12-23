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
                <th v-if="priceWeighting === 'asp'">
                    <label for="pr_w_asp_m">{{ 'PR(W[ASP] (M)' | trans }}</label>
                </th>
                <th v-if="priceWeighting === 'usp'">
                    <label for="pr_w_usp_m">{{ 'PR(W[HSP] (M)' | trans }}</label>
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
                <td v-if="priceWeighting === 'asp'" class="uk-text-center">
                    <input v-model="filter"
                           id="pr_w_asp_m" value="pr_w_asp_m"
                           type="checkbox" class="uk-checkbox" />
                </td>
                <td v-if="priceWeighting === 'usp'" class="uk-text-center">
                    <input v-model="filter"
                           id="pr_w_usp_m" value="pr_w_usp_m"
                           type="checkbox" class="uk-checkbox" />
                </td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Reward/risk ratio (MAR)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'CAGR' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'MDD (Maximum drawdown)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'YTD (Year-To-Date)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'PWR (Portfolio win ratio)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 5) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import MainTable from '@/components/Ui/MainTable';

export default {

    name: 'CompoundTable',

    extends: MainTable,

    data() {
        return {
            startRow: this.mainTableData.findIndex(r => r[0].includes('Compound')),
        };
    },

    computed: {
        priceWeighting() {
            return this.fieldValue(this.startRow, 5).toLowerCase().includes('asp') ? 'asp': 'usp';
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
