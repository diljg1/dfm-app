<template>

    <div>
        <p v-if="error" class="uk-alert uk-alert-danger">
            <span uk-icon="warning" class="uk-margin-small-right"></span>
            {{ error }}
        </p>
        <ul v-else ref="accordion" uk-accordion="active: 0;" class="dfm-accordion uk-accordion uk-accordion-condensed">
            <li>
                <a class="uk-accordion-title" href="#">
                    <h3 class="uk-margin-remove">{{ 'Output Stats' | trans }}</h3>
                </a>
                <div class="uk-accordion-content">
                    <GeneralTable v-if="mainTableData.length" :main-table-data="mainTableData" />
                </div>
            </li>
            <li>
                <a class="uk-accordion-title" href="#">
                    <h3 class="uk-margin-remove">{{ 'Chart Volatility/Timing' | trans }}</h3>
                </a>
                <div class="uk-accordion-content">
                    <h5>{{ graphDefinitions.chart_volatility.title }}</h5>
                    <div uk-grid>
                        <div class="uk-width-medium@m">
                            <br/>
                        </div>
                        <div class="uk-width-expand@m">
                            <SvgGraph v-model="graphFilters.chart_volatility"
                                      :graph-definition="graphDefinitions.chart_volatility"
                                      :svg="svgSources['chart_volatility.svg']"
                                      name="chart_volatility" />
                        </div>
                    </div>
                    <h5>{{ 'Timing' | trans }}</h5>
                    <div uk-grid>
                        <div class="uk-width-medium@m">
                            <ul class="uk-tab-left" uk-tab="connect: #timing-comp">
                                <li><a href="#">{{ graphDefinitions.chart_timing_equ_w_f_comp.title }}</a></li>
                                <li><a href="#">{{ graphDefinitions.chart_timing_equ_w_m_comp.title }}</a></li>
                                <li><a href="#">{{ graphDefinitions.chart_timing_pr_w_asp_m_comp.title }}</a></li>
                                <li><a href="#">{{ graphDefinitions.chart_timing_equ_w_m_constant.title }}</a></li>
                                <li><a href="#">{{ graphDefinitions.chart_timing_pr_w_asp_m_constant.title }}</a></li>
                                <li><a href="#">{{ graphDefinitions.chart_timing_opt_w_constant.title }}</a></li>
                            </ul>
                        </div>
                        <div class="uk-width-expand@m">
                            <ul id="timing-comp" class="uk-switcher">
                                <li>
                                    <TimingTable v-if="mainTableData.length" v-model="graphFilters.chart_timing_equ_w_f_comp"
                                                 :main-table-data="mainTableData"
                                                 :graph-definition="graphDefinitions.chart_timing_equ_w_f_comp"
                                                 :row-index="25" />
                                    <SvgGraph v-model="graphFilters.chart_timing_equ_w_f_comp"
                                              :graph-definition="graphDefinitions.chart_timing_equ_w_f_comp"
                                              :svg="svgSources['chart_timing_equ_w_f_comp.svg']"
                                              :legend="false"
                                              name="chart_timing_equ_w_f_comp" />
                                </li>
                                <li>
                                    <TimingTable v-if="mainTableData.length" v-model="graphFilters.chart_timing_equ_w_m_comp"
                                                 :main-table-data="mainTableData"
                                                 :graph-definition="graphDefinitions.chart_timing_equ_w_m_comp"
                                                 :row-index="28" />
                                    <SvgGraph v-model="graphFilters.chart_timing_equ_w_m_comp"
                                              :graph-definition="graphDefinitions.chart_timing_equ_w_m_comp"
                                              :svg="svgSources['chart_timing_equ_w_m_comp.svg']"
                                              :legend="false"
                                              name="chart_timing_equ_w_m_comp" />
                                </li>
                                <li>
                                    <TimingTable v-if="mainTableData.length" v-model="graphFilters.chart_timing_pr_w_asp_m_comp"
                                                 :main-table-data="mainTableData"
                                                 :graph-definition="graphDefinitions.chart_timing_pr_w_asp_m_comp"
                                                 :row-index="31" />
                                    <SvgGraph v-model="graphFilters.chart_timing_pr_w_asp_m_comp"
                                              :graph-definition="graphDefinitions.chart_timing_pr_w_asp_m_comp"
                                              :svg="svgSources['chart_timing_pr_w_asp_m_comp.svg']"
                                              :legend="false"
                                              name="chart_timing_pr_w_asp_m_comp" />
                                </li>
                                <li>
                                    <TimingTable v-if="mainTableData.length" v-model="graphFilters.chart_timing_equ_w_m_constant"
                                                 :main-table-data="mainTableData"
                                                 :graph-definition="graphDefinitions.chart_timing_equ_w_m_constant"
                                                 :row-index="34" />
                                    <SvgGraph v-model="graphFilters.chart_timing_equ_w_m_constant"
                                              :graph-definition="graphDefinitions.chart_timing_equ_w_m_constant"
                                              :svg="svgSources['chart_timing_equ_w_m_constant.svg']"
                                              :legend="false"
                                              name="chart_timing_equ_w_m_constant" />
                                </li>
                                <li>
                                    <TimingTable v-if="mainTableData.length" v-model="graphFilters.chart_timing_pr_w_asp_m_constant"
                                                 :main-table-data="mainTableData"
                                                 :graph-definition="graphDefinitions.chart_timing_pr_w_asp_m_constant"
                                                 :row-index="37" />
                                    <SvgGraph v-model="graphFilters.chart_timing_pr_w_asp_m_constant"
                                              :graph-definition="graphDefinitions.chart_timing_pr_w_asp_m_constant"
                                              :svg="svgSources['chart_timing_pr_w_asp_m_constant.svg']"
                                              :legend="false"
                                              name="chart_timing_pr_w_asp_m_constant" />
                                </li>
                                <li>
                                    <TimingTable v-if="mainTableData.length" v-model="graphFilters.chart_timing_opt_w_constant"
                                                 :main-table-data="mainTableData"
                                                 :graph-definition="graphDefinitions.chart_timing_opt_w_constant"
                                                 :row-index="40" />
                                    <SvgGraph v-model="graphFilters.chart_timing_opt_w_constant"
                                              :graph-definition="graphDefinitions.chart_timing_opt_w_constant"
                                              :svg="svgSources['chart_timing_opt_w_constant.svg']"
                                              :legend="false"
                                              name="chart_timing_opt_w_constant" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <a class="uk-accordion-title" href="#">
                    <h3 class="uk-margin-remove">{{ graphDefinitions.chart_compound.title }}</h3>
                </a>
                <div class="uk-accordion-content">
                    <CompoundTable v-if="mainTableData.length" v-model="graphFilters.chart_compound"
                                   :main-table-data="mainTableData" />

                    <SvgGraph v-model="graphFilters.chart_compound"
                              :graph-definition="graphDefinitions.chart_compound"
                              :svg="svgSources['chart_compound.svg']"
                              name="chart_compound" />
                </div>
            </li>
            <li>
                <a class="uk-accordion-title" href="#">
                    <h3 class="uk-margin-remove">{{ graphDefinitions.chart_constant.title }}</h3>
                </a>
                <div class="uk-accordion-content">
                    <ConstantTable v-if="mainTableData.length" v-model="graphFilters.chart_constant"
                                   :main-table-data="mainTableData" />

                    <SvgGraph v-model="graphFilters.chart_constant"
                              :graph-definition="graphDefinitions.chart_constant"
                              :svg="svgSources['chart_constant.svg']"
                              name="chart_constant" />
                </div>
            </li>
            <li>
                <a class="uk-accordion-title" href="#">
                    <h3 class="uk-margin-remove">{{ 'Chart # stocks/histogram' | trans }}</h3>
                </a>
                <div class="uk-accordion-content">
                    <h5>{{ graphDefinitions.chart_nr_stocks_a_screening.title }}</h5>
                    <div uk-grid>
                        <div class="uk-width-medium@m">
                            <br/>
                        </div>
                        <div class="uk-width-expand@m">
                            <SvgGraph v-model="graphFilters.chart_nr_stocks_a_screening"
                                      :graph-definition="graphDefinitions.chart_nr_stocks_a_screening"
                                      :svg="svgSources['chart_nr_stocks_a_screening.svg']"
                                      name="chart_nr_stocks_a_screening" />
                        </div>
                    </div>
                    <h5>{{ 'Return distribution' | trans }}</h5>
                    <div uk-grid>
                        <div class="uk-width-medium@m">
                            <ul class="uk-tab-left" uk-tab="connect: #timing-const">
                                <li><a href="#">{{ graphDefinitions.chart_return_distribution_equ_w.title }}</a></li>
                                <li><a href="#">{{ graphDefinitions.chart_return_distribution_pr_w.title }}</a></li>
                                <li><a href="#">{{ graphDefinitions.chart_return_distribution_opt_w.title }}</a></li>
                            </ul>
                        </div>
                        <div class="uk-width-expand@m">
                            <ul id="timing-const" class="uk-switcher">
                                <li>
                                    <SvgGraph v-model="graphFilters.chart_return_distribution_equ_w"
                                              :graph-definition="graphDefinitions.chart_return_distribution_equ_w"
                                              :svg="svgSources['chart_return_distribution_equ_w.svg']"
                                              name="chart_return_distribution_equ_w" />
                                </li>
                                <li>
                                    <SvgGraph v-model="graphFilters.chart_return_distribution_pr_w"
                                              :graph-definition="graphDefinitions.chart_return_distribution_pr_w"
                                              :svg="svgSources['chart_return_distribution_pr_w.svg']"
                                              name="chart_return_distribution_pr_w" />
                                </li>
                                <li>
                                    <SvgGraph v-model="graphFilters.chart_return_distribution_opt_w"
                                              :graph-definition="graphDefinitions.chart_return_distribution_opt_w"
                                              :svg="svgSources['chart_return_distribution_opt_w.svg']"
                                              name="chart_return_distribution_opt_w" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <a class="uk-accordion-title" href="#">
                    <h3 class="uk-margin-remove">{{ 'Monday trades' | trans }}</h3>
                </a>
                <div class="uk-accordion-content">
                    <StockTable v-if="stockCsvs.length" :files="stockCsvs" />
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import defaults from 'lodash/defaults';
import Papa from 'papaparse';

import StockTable from '@/components/StockTable';
import GeneralTable from '@/components/GeneralTable';
import CompoundTable from '@/components/CompoundTable';
import ConstantTable from '@/components/ConstantTable';
import TimingTable from '@/components/TimingTable';
import SvgGraph from '@/components/SvgGraph';

const MAINTABLE_CSV_NAME = 'main_table.csv';
const STOCKTABLE_CSV_NAMES = ['monday_trades_equ_w.csv', 'monday_trades_opt_w.csv', 'monday_trades_pr_w.csv',];

export default {

    name: 'Preview',

    components: {
        StockTable,
        GeneralTable,
        CompoundTable,
        ConstantTable,
        SvgGraph,
        TimingTable,
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
                            className: 's_p_500',
                            legend: this.$trans('chart.legend.s_p_500'),
                        },
                        {
                            className: 'random_500_f',
                            legend: this.$trans('chart.legend.random_500_f'),
                        },
                        {
                            className: 'equ_w_m',
                            legend: this.$trans('chart.legend.equ_w_m'),
                        },
                        {
                            className: 'pr_w_asp_m',
                            legend: this.$trans('chart.legend.pr_w_asp_m'),
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
                            className: 'pr_w_asp_m_cashflow',
                            legend: this.$trans('chart.legend.pr_w_asp_m_cashflow'),
                        },
                        {
                            className: 'prw_m_net_liquidation',
                            legend: this.$trans('chart.legend.prw_m_net_liquidation'),
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
        error() {
            return Object.keys(this.previewRequest.files)
                .filter(filename => filename.includes('error'))
                .map(filename => this.previewRequest.files[filename])
                .join(', ');
        },
        mainTableData() {
            if (!this.csvSources[MAINTABLE_CSV_NAME]) {
                return [];
            }
            return this.csvSources[MAINTABLE_CSV_NAME].data;
        },
        csvSources() {
            const sources = {};
            Object.keys(this.previewRequest.files).filter(filename => filename.includes('.csv')).forEach(filename => {
                sources[filename] = Papa.parse(this.previewRequest.files[filename], {
                    header: false,
                });
            });
            return sources;
        },
        svgSources() {
            const sources = {};
            Object.keys(this.previewRequest.files).filter(filename => filename.includes('.svg')).forEach(filename => {
                sources[filename] = this.previewRequest.files[filename];
            });
            return sources;
        },
    },

    watch: {
        'graphFilters': {
            handler(filter) {
                sessionStorage.setItem('graphFilters', JSON.stringify(filter));
            },
            deep: true,
        }
    },
};
</script>
