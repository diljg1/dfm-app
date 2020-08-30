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
        <h3>{{ graphDefinitions.chart_compound.title }}</h3>
        <SvgGraph v-model="graphFilters.chart_compound"
                  :graph-definition="graphDefinitions.chart_compound"
                  :svg="svgSources['chart_compound.svg']"
                  name="chart_compound" />
        <h3>{{ graphDefinitions.chart_constant.title }}</h3>
        <SvgGraph v-model="graphFilters.chart_constant"
                  :graph-definition="graphDefinitions.chart_constant"
                  :svg="svgSources['chart_constant.svg']"
                  name="chart_constant" />

        <div class="uk-child-width-1-2@s uk-grid-small" uk-grid>
            <div>
                <h3>{{ graphDefinitions.chart_nr_stocks_a_screening.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_nr_stocks_a_screening"
                          :graph-definition="graphDefinitions.chart_nr_stocks_a_screening"
                          :svg="svgSources['chart_nr_stocks_a_screening.svg']"
                          name="chart_nr_stocks_a_screening" />
            </div>
            <div>
                <h3>{{ graphDefinitions.chart_volatility.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_volatility"
                          :graph-definition="graphDefinitions.chart_volatility"
                          :svg="svgSources['chart_volatility.svg']"
                          name="chart_volatility" />
            </div>
        </div>

        <div class="uk-child-width-1-3@s uk-grid-small" uk-grid>
            <div>
                <h3>{{ graphDefinitions.chart_timing_equ_w_f_comp.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_timing_equ_w_f_comp"
                          :graph-definition="graphDefinitions.chart_timing_equ_w_f_comp"
                          :svg="svgSources['chart_timing_equ_w_f_comp.svg']"
                          name="chart_timing_equ_w_f_comp" />
            </div>
            <div>
                <h3>{{ graphDefinitions.chart_timing_equ_w_m_comp.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_timing_equ_w_m_comp"
                          :graph-definition="graphDefinitions.chart_timing_equ_w_m_comp"
                          :svg="svgSources['chart_timing_equ_w_m_comp.svg']"
                          name="chart_timing_equ_w_m_comp" />
            </div>
            <div>
                <h3>{{ graphDefinitions.chart_timing_pr_w_asp_m_comp.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_timing_pr_w_asp_m_comp"
                          :graph-definition="graphDefinitions.chart_timing_pr_w_asp_m_comp"
                          :svg="svgSources['chart_timing_pr_w_asp_m_comp.svg']"
                          name="chart_timing_pr_w_asp_m_comp" />
            </div>
        </div>

        <div class="uk-child-width-1-3@s uk-grid-small" uk-grid>
            <div>
                <h3>{{ graphDefinitions.chart_timing_equ_w_m_constant.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_timing_equ_w_m_constant"
                          :graph-definition="graphDefinitions.chart_timing_equ_w_m_constant"
                          :svg="svgSources['chart_timing_equ_w_m_constant.svg']"
                          name="chart_timing_equ_w_m_constant" />
            </div>
            <div>
                <h3>{{ graphDefinitions.chart_timing_pr_w_asp_m_constant.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_timing_pr_w_asp_m_constant"
                          :graph-definition="graphDefinitions.chart_timing_pr_w_asp_m_constant"
                          :svg="svgSources['chart_timing_pr_w_asp_m_constant.svg']"
                          name="chart_timing_pr_w_asp_m_constant" />
            </div>
            <div>
                <h3>{{ graphDefinitions.chart_timing_opt_w_constant.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_timing_opt_w_constant"
                          :graph-definition="graphDefinitions.chart_timing_opt_w_constant"
                          :svg="svgSources['chart_timing_opt_w_constant.svg']"
                          name="chart_timing_opt_w_constant" />
            </div>
        </div>

        <div class="uk-margin uk-grid-small" uk-grid>
            <div class="uk-width-1-2@s">
                <h3>{{ graphDefinitions.chart_return_distribution_equ_w.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_return_distribution_equ_w"
                          :graph-definition="graphDefinitions.chart_return_distribution_equ_w"
                          :svg="svgSources['chart_return_distribution_equ_w.svg']"
                          name="chart_return_distribution_equ_w" />

                <h3>{{ graphDefinitions.chart_return_distribution_pr_w.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_return_distribution_pr_w"
                          :graph-definition="graphDefinitions.chart_return_distribution_pr_w"
                          :svg="svgSources['chart_return_distribution_pr_w.svg']"
                          name="chart_return_distribution_pr_w" />

                <h3>{{ graphDefinitions.chart_return_distribution_opt_w.title }}</h3>
                <SvgGraph v-model="graphFilters.chart_return_distribution_opt_w"
                          :graph-definition="graphDefinitions.chart_return_distribution_opt_w"
                          :svg="svgSources['chart_return_distribution_opt_w.svg']"
                          name="chart_return_distribution_opt_w" />
            </div>
            <div class="uk-width-1-2@s">
                <h3>{{ 'Monday trades' | trans }}</h3>
                <StockTable v-if="stockCsvs.length" :files="stockCsvs" />
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

const STOCKTABLE_CSV_NAMES = ['monday_trades_equ_w.csv', 'monday_trades_opt_w.csv', 'monday_trades_pr_w.csv',];

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
                chart_nr_stocks_a_screening: ['stocks_before_ranking', 'stocks_required',],
                chart_volatility: ['volatility',],
                chart_timing_equ_w_f_comp: ['default', 'best', 'worst',],
                chart_timing_equ_w_m_comp: ['default', 'best', 'worst',],
                chart_timing_pr_w_asp_m_comp: ['default', 'best', 'worst',],
                chart_timing_equ_w_m_constant: ['default', 'best', 'worst',],
                chart_timing_pr_w_asp_m_constant: ['default', 'best', 'worst',],
                chart_timing_opt_w_constant: ['default', 'best', 'worst',],
                chart_return_distribution_equ_w: ['return_distribution',],
                chart_return_distribution_pr_w: ['return_distribution',],
                chart_return_distribution_opt_w: ['return_distribution',],
            }),
            graphDefinitions: {
                chart_compound: {
                    title: this.$trans('chart.title.compound'),
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
                    title: this.$trans('chart.title.constant'),
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
                chart_nr_stocks_a_screening: {
                    title: this.$trans('chart.title.nr_stocks_a_screening'),
                    dataSets: [
                        {
                            className: 'stocks_before_ranking',
                            legend: this.$trans('chart.legend.stocks_before_ranking'),
                        },
                        {
                            className: 'stocks_required',
                            legend: this.$trans('chart.legend.stocks_required'),
                        },
                    ],
                },
                chart_volatility: {
                    title: this.$trans('chart.title.volatility'),
                    dataSets: [
                        {
                            className: 'volatility',
                            legend: this.$trans('chart.legend.volatility'),
                        },
                    ],
                },
                chart_timing_equ_w_f_comp: {
                    title: this.$trans('chart.title.timing_equ_w_f_comp'),
                    dataSets: [
                        {
                            className: 'default',
                            legend: this.$trans('chart.legend.default'),
                        },
                        {
                            className: 'best',
                            legend: this.$trans('chart.legend.best'),
                        },
                        {
                            className: 'worst',
                            legend: this.$trans('chart.legend.worst'),
                        },
                    ],
                },
                chart_timing_equ_w_m_comp: {
                    title: this.$trans('chart.title.timing_equ_w_m_comp'),
                    dataSets: [
                        {
                            className: 'default',
                            legend: this.$trans('chart.legend.default'),
                        },
                        {
                            className: 'best',
                            legend: this.$trans('chart.legend.best'),
                        },
                        {
                            className: 'worst',
                            legend: this.$trans('chart.legend.worst'),
                        },
                    ],
                },
                chart_timing_pr_w_asp_m_comp: {
                    title: this.$trans('chart.title.timing_pr_w_asp_m_comp'),
                    dataSets: [
                        {
                            className: 'default',
                            legend: this.$trans('chart.legend.default'),
                        },
                        {
                            className: 'best',
                            legend: this.$trans('chart.legend.best'),
                        },
                        {
                            className: 'worst',
                            legend: this.$trans('chart.legend.worst'),
                        },
                    ],
                },
                chart_timing_equ_w_m_constant: {
                    title: this.$trans('chart.title.timing_equ_w_m_constant'),
                    dataSets: [
                        {
                            className: 'default',
                            legend: this.$trans('chart.legend.default'),
                        },
                        {
                            className: 'best',
                            legend: this.$trans('chart.legend.best'),
                        },
                        {
                            className: 'worst',
                            legend: this.$trans('chart.legend.worst'),
                        },
                    ],
                },
                chart_timing_pr_w_asp_m_constant: {
                    title: this.$trans('chart.title.timing_pr_w_asp_m_constant'),
                    dataSets: [
                        {
                            className: 'default',
                            legend: this.$trans('chart.legend.default'),
                        },
                        {
                            className: 'best',
                            legend: this.$trans('chart.legend.best'),
                        },
                        {
                            className: 'worst',
                            legend: this.$trans('chart.legend.worst'),
                        },
                    ],
                },
                chart_timing_opt_w_constant: {
                    title: this.$trans('chart.title.timing_opt_w_constant'),
                    dataSets: [
                        {
                            className: 'default',
                            legend: this.$trans('chart.legend.default'),
                        },
                        {
                            className: 'best',
                            legend: this.$trans('chart.legend.best'),
                        },
                        {
                            className: 'worst',
                            legend: this.$trans('chart.legend.worst'),
                        },
                    ],
                },
                chart_return_distribution_equ_w: {
                    title: this.$trans('chart.title.return_distribution_equ_w'),
                    dataSets: [
                        {
                            className: 'return_distribution',
                            legend: this.$trans('chart.legend.return_distribution'),
                        },
                    ],
                },
                chart_return_distribution_pr_w: {
                    title: this.$trans('chart.title.return_distribution_pr_w'),
                    dataSets: [
                        {
                            className: 'return_distribution',
                            legend: this.$trans('chart.legend.return_distribution'),
                        },
                    ],
                },
                chart_return_distribution_opt_w: {
                    title: this.$trans('chart.title.return_distribution_opt_w'),
                    dataSets: [
                        {
                            className: 'return_distribution',
                            legend: this.$trans('chart.legend.return_distribution'),
                        },
                    ],
                },
            },
        };
    },

    computed: {
        stockCsvs() {
            const files = [];
            STOCKTABLE_CSV_NAMES.forEach(name => {
                if (this.csvSources[name]) {
                    const {data, errors, meta: {aborted,}} = this.csvSources[name];
                    if (aborted) {
                        console.error(errors);
                        return false;
                    }
                    files.push({name, data,});
                }
            });
            return files;
        },
        csvSources() {
            const sources = {};
            Object.keys(this.previewRequest.files).filter(filename => filename.includes('.csv')).forEach(filename => {
                sources[filename] = Papa.parse(this.previewRequest.files[filename], {
                    header: false,
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
