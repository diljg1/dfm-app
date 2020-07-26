<template>

    <div>
        <div class="uk-margin uk-flex uk-flex-center">
            <a class="uk-button uk-button-small uk-button-primary uk-margin-small-right"
               :href="links.trial_link" target="_blank" rel="noopener noreferrer">
                {{ 'Koop 30-dagen trial €30' | trans }}
            </a>
            <a class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
               :href="links.license_link" target="_blank" rel="noopener noreferrer">
                {{ 'Koop jaarlicentie €300' | trans }}
            </a>
            <a class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
               :href="links.csi_link" target="_blank" rel="noopener noreferrer">
                {{ 'Koop CSI data jaarabonnement' | trans }}
            </a>
        </div>
        <h3>Constant</h3>
        <SvgGraph v-model="graphFilters.chart_constant"
                  :graph-definition="graphDefinitions.chart_constant"
                  :svg="svgSources['chart_constant.svg']"
                  name="chart_constant" />
        <div class="uk-margin uk-grid-small" uk-grid>
            <div class="uk-width-2-3@s">
                <h3>Compound</h3>
                <SvgGraph v-model="graphFilters.chart_compound"
                          :graph-definition="graphDefinitions.chart_compound"
                          :svg="svgSources['chart_compound.svg']"
                          name="chart_compound" />
                <h3>Divers</h3>
                <SvgGraph v-model="graphFilters.chart_miscellaneous"
                          :graph-definition="graphDefinitions.chart_miscellaneous"
                          :svg="svgSources['chart_miscellaneous.svg']"
                          name="chart_miscellaneous" />
            </div>
            <div class="uk-width-1-3@s">
                <StockTable v-if="stockCsv" :data="stockCsv.data" :fields="stockCsv.fields"/>
            </div>
        </div>
    </div>

</template>
<script>
import {mapState,} from 'vuex';
import defaults from 'lodash/defaults';
import Papa from 'papaparse';

import StockTable from '@/components/StockTable';
import SvgGraph from '@/components/SvgGraph';

const STOCKTABLE_CSV_NAME = 'data_1.csv';

export default {

    name: 'Preview',

    components: {
        StockTable,
        SvgGraph,
    },

    props: {
        previewRequest: Object,
    },

    data() {
        return {
            graphFilters: defaults((JSON.parse(sessionStorage.getItem('graphFilters') || '{}')), {
                chart_compound: ['equ_w_m', 'random_500_f',],
                chart_constant: ['equ_w_m_net_liquidation_value', 'pr_w_asp_m_cashflow', 'prw_m_net_liquidation',],
                chart_miscellaneous: ['stocks_before_ranking', 'stocks_required', 'volatility',],
            }),
            graphDefinitions: {
                chart_compound: {
                    dataSets: [
                        {
                            className: 'equ_w_f',
                            legend: this.$trans('chart.legend.equ_w_f'),
                        },
                        {
                            className: 'equ_w_m',
                            legend: this.$trans('chart.legend.equ_w_m'),
                        },
                        {
                            className: 'pr_w_asp_m',
                            legend: this.$trans('chart.legend.pr_w_asp_m'),
                        },
                        {
                            className: 'random_500_f',
                            legend: this.$trans('chart.legend.random_500_f'),
                        },
                        {
                            className: 's_p_500',
                            legend: this.$trans('chart.legend.s_p_500'),
                        },
                    ],
                },
                chart_constant: {
                    dataSets: [
                        {
                            className: 'equ_w_m_cashflow',
                            legend: this.$trans('chart.legend.equ_w_m_cashflow'),
                        },
                        {
                            className: 'equ_w_m_net_liquidation_value',
                            legend: this.$trans('chart.legend.equ_w_m_net_liquidation_value'),
                        },
                        {
                            className: 'opt_w_cashflow',
                            legend: this.$trans('chart.legend.opt_w_cashflow'),
                        },
                        {
                            className: 'opt_w_net_liquidation_value',
                            legend: this.$trans('chart.legend.opt_w_net_liquidation_value'),
                        },
                        {
                            className: 'pr_w_asp_m_cashflow',
                            legend: this.$trans('chart.legend.pr_w_asp_m_cashflow'),
                        },
                        {
                            className: 'prw_m_net_liquidation',
                            legend: this.$trans('chart.legend.prw_m_net_liquidation'),
                        },
                        {
                            className: 'sandp500_cashflow',
                            legend: this.$trans('chart.legend.sandp500_cashflow'),
                        },
                    ],
                },
                chart_miscellaneous: {
                    dataSets: [
                        {
                            className: 'stocks_before_ranking',
                            legend: this.$trans('chart.legend.stocks_before_ranking'),
                        },
                        {
                            className: 'stocks_required',
                            legend: this.$trans('chart.legend.stocks_required'),
                        },
                        {
                            className: 'volatility',
                            legend: this.$trans('chart.legend.volatility'),
                        },
                    ],
                },
            },
        };
    },

    computed: {
        stockCsv() {
            if (this.csvSources[STOCKTABLE_CSV_NAME] === undefined) {
                return false;
            }
            const {data, errors, meta: {aborted, fields}} = this.csvSources[STOCKTABLE_CSV_NAME];
            if (aborted) {
                console.error(errors);
                return false;
            }
            return {data, fields};
        },
        csvSources() {
            const sources = {};
            Object.keys(this.previewRequest.files).filter(filename => filename.includes('.csv')).forEach(filename => {
                sources[filename] = Papa.parse(this.previewRequest.files[filename], {
                    delimiter: ';',
                    header: true,
                });
            });
            console.log(sources);
            return sources;
        },
        svgSources() {
            const sources = {};
            Object.keys(this.previewRequest.files).filter(filename => filename.includes('.svg')).forEach(filename => {
                sources[filename] = this.previewRequest.files[filename];
            });
            return sources;
        },
        ...mapState({
            links: state => state.links,
        }),
    },

    watch: {
        'graphFilters': {
            handler(filter) {
                sessionStorage.setItem('graphFilters', JSON.stringify(filter));
            },
            deep: true,
        }
    },

    methods: {

    },
};
</script>
