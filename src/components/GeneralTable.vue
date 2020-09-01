<template>
    <div>
        <h4>{{ title }}</h4>
        <table class="uk-table uk-table-divider uk-table-small">
            <thead>
            <tr>
                <th>
                    {{ 'General' | trans }}
                </th>
                <th>
                    {{ '(F)riday' | trans }}
                </th>
                <th>
                    {{ '(M)onday' | trans }}
                </th>
                <th>
                    {{ 'Opt.W' | trans }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Investment' | trans }}</td>
                <td colspan="3" class="uk-text-center">{{ fieldValue(2, 1) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Commission & tax' | trans }}</td>
                <td colspan="3" class="uk-text-center">{{ fieldValue(3, 1) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Average number of stocks' | trans }}</td>
                <td colspan="2" class="uk-text-center">{{ fieldValue(4, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(4, 3) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Stock turnover' | trans }}</td>
                <td colspan="2" class="uk-text-center">{{ fieldValue(5, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(5, 3) }}</td>
            </tr>
            <tr class="uk-text-nowrap">
                <td class="uk-text-bold">{{ 'Picking accuracy' | trans }}</td>
                <td class="uk-text-center">{{ fieldValue(6, 1) }}</td>
                <td class="uk-text-center">{{ fieldValue(6, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(6, 3) }}</td>
            </tr>
            </tbody>

        </table>
    </div>
</template>
<script>
import MainTable from '@/components/Ui/MainTable';

export default {

    name: 'GeneralTable',

    extends: MainTable,

    computed: {
        title() {
            return this.fieldValue(0, 0);
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
