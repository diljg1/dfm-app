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
                <th>
                    <label for="pr_w_asp_m_cashflow">{{ 'PR(W[ASP] (M)' | trans }}</label>
                </th>
                <th>
                    <label for="opt_w_cashflow">{{ 'Opt.W' | trans }}</label>
                </th>
                <th colspan="2">
                    <label for="sandp500_cashflow">{{ 'Opt.W, benchmark [S&P500]' | trans }}</label>
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
                <td class="uk-text-center">
                    <span :title="$trans('Cashflow')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="pr_w_asp_m_cashflow" value="pr_w_asp_m_cashflow"
                               type="checkbox" class="uk-checkbox" />
                    </span>
                    <span class="uk-margin-small-left" :title="$trans('Liquidation value')" uk-tooltip="delay: 200">
                        <input v-model="filter"
                               id="prw_m_net_liquidation" value="prw_m_net_liquidation"
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
                    <input v-model="filter"
                           id="sandp500_cashflow" value="sandp500_cashflow"
                           type="checkbox" class="uk-checkbox" />
                </td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Reward/risk ratio (MAR)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(18, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(18, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(18, 3) }}</td>
                <td class="uk-text-bold">{{ 'Sharpe ratio' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(18, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'EAGR' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(19, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(19, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(19, 3) }}</td>
                <td class="uk-text-bold">{{ 'Alpha' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(19, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'MDD (Maximum drawdown)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(20, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(20, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(20, 3) }}</td>
                <td class="uk-text-bold">{{ 'Beta' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(20, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'YTD (Year-To-Date)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(21, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(21, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(21, 3) }}</td>
                <td class="uk-text-bold">{{ 'VeV' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(21, 5) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'PWR (Portfolio win ratio)' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(22, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(22, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(22, 3) }}</td>
                <td class="uk-text-bold">{{ 'Risk Ind.' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(22, 5) }}</td>
            </tr>
            <tr>
                <td colspan="6" class="uk-text-right uk-text-italic">{{ fieldValue(23, 5) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import get from 'lodash/get';

export default {

    name: 'ConstantTable',

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
