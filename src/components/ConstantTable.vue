<template>
    <div>
        <table class="uk-table uk-table-divider uk-table-small">
            <thead>
            <tr>
                <th>
                    {{ 'Constant investment' | trans }}
                </th>
                <th>
                    <label for="equ_w_m_cashflow">{{ 'Equ.W (M)' | trans }}</label>
                </th>
                <th v-if="priceWeighting === 'asp'">
                    <label for="pr_w_asp_m_cashflow">{{ 'PR(W[ASP] (M)' | trans }}</label>
                </th>
                <th v-if="priceWeighting === 'usp'">
                    <label for="pr_w_usp_m_cashflow">{{ 'PR(W[HSP] (M)' | trans }}</label>
                </th>
                <th>
                    <label for="opt_w_cashflow">{{ 'Opt.W' | trans }}</label>
                </th>
                <th v-if="benchmark === 's_p_500'" colspan="2">
                    <label for="s_p_500_cashflow">{{ 'Opt.W, benchmark [S&P500]' | trans }}</label>
                </th>
                <th v-if="benchmark === 'djia'" colspan="2">
                    <label for="djia_cashflow">{{ 'Opt.W, benchmark [DJIA]' | trans }}</label>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td class="uk-text-bold">{{ 'Show' | trans }}</td>
                <td class="uk-text-center">
                    <span :title="$trans('Cashflow')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="equ_w_m_cashflow" value="equ_w_m_cashflow"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                    <span class="uk-margin-small-left" :title="$trans('Liquidation value')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="equ_w_m_net_liquidation_value" value="equ_w_m_net_liquidation_value"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                </td>
                <td v-if="priceWeighting === 'asp'" class="uk-text-center">
                    <span :title="$trans('Cashflow')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="pr_w_asp_m_cashflow" value="pr_w_asp_m_cashflow"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                    <span class="uk-margin-small-left" :title="$trans('Liquidation value')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="prw_asp_m_net_liquidation" value="prw_asp_m_net_liquidation"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                </td>
                <td v-if="priceWeighting === 'usp'" class="uk-text-center">
                    <span :title="$trans('Cashflow')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="pr_w_usp_m_cashflow" value="pr_w_usp_m_cashflow"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                    <span class="uk-margin-small-left" :title="$trans('Liquidation value')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="prw_usp_m_net_liquidation" value="prw_usp_m_net_liquidation"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                </td>
                <td class="uk-text-center">
                    <span :title="$trans('Cashflow')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="opt_w_cashflow" value="opt_w_cashflow"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                    <span class="uk-margin-small-left" :title="$trans('Liquidation value')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="opt_w_net_liquidation_value" value="opt_w_net_liquidation_value"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                </td>
                <td colspan="2" class="uk-text-center">
                    <input v-if="benchmark === 's_p_500'"
                           v-model="filter"
                           id="s_p_500_cashflow" value="s_p_500_cashflow"
                           type="checkbox" class="uk-checkbox" />
                    <input v-if="benchmark === 'djia'"
                           v-model="filter"
                           id="djia_cashflow" value="djia_cashflow"
                           type="checkbox" class="uk-checkbox" />
                </td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Reward/risk ratio (MAR)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 3) }}</td>
                <td class="uk-text-bold">{{ 'Sharpe ratio' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 1, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'EAGR' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 3) }}</td>
                <td class="uk-text-bold">{{ 'Alpha' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 2, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'MDD (Maximum drawdown)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 3) }}</td>
                <td class="uk-text-bold">{{ 'Beta' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 3, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'YTD (Year-To-Date)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 3) }}</td>
                <td class="uk-text-bold">{{ 'VeV' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 4, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'PWR (Portfolio win ratio)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 3) }}</td>
                <td class="uk-text-bold">{{ 'Risk Ind.' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(this.startRow + 5, 5) }}</td>
            </tr>
            <tr>
                <td colspan="6" class="uk-text-right uk-text-italic">{{ fieldValue(this.startRow + 5, 4) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import MainTable from '@/components/Ui/MainTable';

export default {

    name: 'ConstantTable',

    extends: MainTable,

    data() {
        return {
            startRow: this.mainTableData.findIndex(r => r[0].includes('Constant')),
        };
    },

    computed: {
        priceWeighting() {
            return this.fieldValue(this.startRow, 2).toLowerCase().includes('asp') ? 'asp': 'usp';
        },
        benchmark() {
            return this.fieldValue(this.startRow, 4).toLowerCase().includes('djia') ? 'djia': 's_p_500';
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
