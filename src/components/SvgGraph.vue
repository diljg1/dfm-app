<template>
    <div :class="`graph-${name}`">
        <div v-if="legend" class="uk-flex uk-flex-center uk-flex-wrap legend">
            <div v-for="field in activeDataSets" :key="field.className">
                <label :class="[filter.includes(field.className) && graphDefinition.dataSets.length > 1 ? 'active' : '']">
                    <input v-if="graphDefinition.dataSets.length > 1"
                           v-model="filter"
                           :value="field.className"
                           type="checkbox"
                           class="uk-checkbox uk-margin-small-right"/>
                    <LegendLine :field="field" />
                    {{ field.legend }}
                </label>
            </div>
        </div>
        <div ref="svg" v-html="svg"></div>
    </div>
</template>
<script>

import LegendLine from '@/components/Ui/LegendLine';

export default {

    name: 'SvgGraph',

    components: {
        LegendLine,
    },

    props: {
        value: Array,
        name: String,
        graphDefinition: Object,
        svg: String,
        legend: {type: Boolean, default: true,},
    },

    data: () => ({
        activeGraphs: [],
        activeDataSets: [],
    }),

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

    mounted() {
        this.setActiveDataSets();
        this.$watch('filter', this.applyFilter, {immediate: true,});
    },

    methods: {
        setActiveDataSets() {
            this.activeGraphs = Array.from(this.$refs.svg.getElementsByClassName('graph'));
            const graphClasses = this.activeGraphs.map(el => el.getAttribute('class').replace('graph ', ''));
            this.activeDataSets = this.graphDefinition.dataSets.filter(ds => graphClasses.includes(ds.className));
        },
        applyFilter() {
            const activeRegex = new RegExp(`(${this.filter.join('|')})`);
            this.activeGraphs.forEach(el => {
                const visible = this.filter.length && el.getAttribute('class').match(activeRegex) !== null;
                el.classList[visible ? 'add' : 'remove']('graph-visible');
            });
        },
    },
};
</script>
<style lang="less">
    @import '../vars.less';
    .legend > div {
        margin: 0 5px 5px 0;
        label {
            display: block;
            padding: 3px 8px;
            border: 1px solid rgba(255, 225, 255, 0.1);
            transition: border 0.5s ease-in-out;
            &.active {
                border: 1px solid rgba(255, 225, 255, 0.6);
            }
        }
    }
    svg {
        .graph, rect {
            transition: opacity 0.5s ease-in-out;
            opacity: 0;
        }
        .graph-visible {
            opacity: 1;
        }
        .grid path {
            stroke: none;
        }
        .grid line {
            stroke: #0c4555;
        }
    }
    .graph-chart_compound {
        .legend-line {
            &.equ_w_f::after {background-color: @graph_1;}
            &.equ_w_m::after {background-color: @graph_2;}
            &.pr_w_asp_m::after {background-color: @graph_3;}
            &.pr_w_usp_m::after {background-color: @graph_3;}
            &.random_500_f::after {background-color: @graph_6;}
            &.s_p_500::after {background-color: @graph_5;}
            &.djia::after {background-color: @graph_5;}
        }
        svg {
            .equ_w_f {stroke: @graph_1;}
            .equ_w_m {stroke: @graph_2;}
            .pr_w_asp_m {stroke: @graph_3;}
            .pr_w_usp_m {stroke: @graph_3;}
            .random_500_f {stroke: @graph_6;}
            .s_p_500 {stroke: @graph_5;}
            .djia {stroke: @graph_5;}
        }
    }
    .graph-chart_constant {
        .legend-line {
            &.equ_w_m_cashflow::after {background-color: @graph_2;}
            &.equ_w_m_net_liquidation_value::after {background-color: @graph_7;}
            &.opt_w_cashflow::after {background-color: @graph_4;}
            &.opt_w_net_liquidation_value::after {background-color: @graph_8;}
            &.pr_w_asp_m_cashflow::after {background-color: @graph_3;}
            &.pr_w_usp_m_cashflow::after {background-color: @graph_3;}
            &.prw_asp_m_net_liquidation::after {background-color: @graph_6;}
            &.prw_usp_m_net_liquidation::after {background-color: @graph_6;}
            &.s_p_500_cashflow::after {background-color: @graph_5;}
            &.djia_cashflow::after {background-color: @graph_5;}
        }
        svg {
            .equ_w_m_cashflow {stroke: @graph_2;}
            .equ_w_m_net_liquidation_value {stroke: @graph_7;}
            .opt_w_cashflow {stroke: @graph_4;}
            .opt_w_net_liquidation_value {stroke: @graph_8;}
            .pr_w_asp_m_cashflow {stroke: @graph_3;}
            .pr_w_usp_m_cashflow {stroke: @graph_3;}
            .prw_asp_m_net_liquidation {stroke: @graph_6;}
            .prw_usp_m_net_liquidation {stroke: @graph_6;}
            .s_p_500_cashflow {stroke: @graph_5;}
            .djia_cashflow {stroke: @graph_5;}
        }
    }
    .graph-chart_nr_stocks_a_screening {
        .legend-line {
            &.stocks_before_ranking::after {background-color: @graph_4;}
            &.stocks_required::after {background-color: @graph_2;}
        }
        svg {
            .stocks_before_ranking {stroke: @graph_4;}
            .stocks_required {stroke: @graph_2;}
        }
    }
    .graph-chart_volatility {
        .legend-line {
            &.volatility::after {background-color: @graph_4;}
        }
        svg {
            .volatility {stroke: @graph_4;}
        }
    }
    .graph-chart_timing_equ_w_f_comp, .graph-chart_timing_equ_w_m_comp,
    .graph-chart_timing_pr_w_asp_m_comp, .graph-chart_timing_pr_w_usp_m_comp,
    .graph-chart_timing_equ_w_m_constant, .graph-chart_timing_pr_w_asp_m_constant,
    .graph-chart_timing_pr_w_usp_m_constant, .graph-chart_timing_opt_w_constant {
        .legend-line {
            &.default::after {background-color: @graph_4;}
            &.best::after {background-color: @graph_1;}
            &.worst::after {background-color: @graph_2;}
        }
        svg {
            .default {stroke: @graph_4;}
            .best {stroke: @graph_1;}
            .worst {stroke: @graph_2;}
        }
    }
    .graph-chart_return_distribution_equ_w, .graph-chart_return_distribution_opt_w, .graph-chart_return_distribution_pr_w {
        .legend-line {
            &.return_distribution::after {background-color: @graph_4;}
        }
        svg {
            .return_distribution {
                fill: @graph_4;
            }
        }
    }
</style>
