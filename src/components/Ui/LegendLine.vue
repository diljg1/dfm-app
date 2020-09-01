<script>
export default {

    name: 'LegendLine',

    functional: true,

    props: {
        field: Object,
    },

    render(h, context) {
        return h('div', {class: 'legend-line ' + context.props.field.className,});
    }

}
</script>
<style lang="less" scoped>
@import '../../vars.less';
.legend-line {
        display: inline-block;
        position: relative;
        width: 30px;
        height: 10px;
        &::after {
            position: absolute;
            content: "";
            height: 2px;
            top: 4px;
            left: 0;
            right: 0;
        }
        &.default::after {background-color: @graph_2;}
        &.best::after {background-color: @graph_3;}
        &.worst::after {background-color: @graph_1;}
    }
</style>
