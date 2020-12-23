import get from 'lodash/get';

export default {

    props: {
        mainTableData: Array,
        value: Array,
        previewId: String,
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
