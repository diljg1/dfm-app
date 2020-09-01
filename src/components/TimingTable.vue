<template>
    <div>
        <table class="uk-table uk-table-divider uk-table-small">
            <thead>
            <tr>
                <th>
                    {{ 'Timing' | trans }}
                </th>
                <th>
                    {{ 'Date' | trans }}
                </th>
                <th>
                    {{ 'Reward/Risk' | trans }}
                </th>
                <th>
                    {{ 'Reward' | trans }}
                </th>
                <th>
                    {{ 'Risk' | trans }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(field, i) in graphDefinition.dataSets" :key="field.className">
                <td class="uk-text-nowrap">
                    <label>
                        <input v-if="graphDefinition.dataSets.length > 1"
                               v-model="filter"
                               :value="field.className"
                               type="checkbox"
                               class="uk-checkbox uk-margin-small-right"/>
                        <LegendLine :field="field" />
                        {{ field.legend }}
                    </label>
                </td>
                <td class="uk-text-center">{{ fieldValue(rowIndex + i, 2) }}</td>
                <td class="uk-text-center">{{ fieldValue(rowIndex + i, 3) }}</td>
                <td class="uk-text-center">{{ fieldValue(rowIndex + i, 4) }}</td>
                <td class="uk-text-center">{{ fieldValue(rowIndex + i, 5) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import MainTable from '@/components/Ui/MainTable';
import LegendLine from '@/components/Ui/LegendLine';

export default {

    name: 'TimingTable',

    extends: MainTable,

    components: {
        LegendLine,
    },

    props: {
        rowIndex: Number,
        graphDefinition: Object,
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
