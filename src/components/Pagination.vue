<template>
    <div class="uk-flex uk-flex-middle">
        <ul v-if="last_page > 1" class="uk-pagination uk-flex-1 uk-flex-center uk-margin-remove">
            <li v-if="previous">
                <a @click="selectPage(previous)"><span uk-pagination-previous></span></a>
            </li>
            <li v-if="first">
                <a @click="selectPage(first)">1</a>
            </li>

            <li v-if="dotsBefore" class="uk-disabled">
                <span>...</span>
            </li>
            <!-- eslint-disable-next-line vue/require-v-for-key-->
            <li v-for="page in before">
                <a @click="selectPage(page)">{{ page }}</a>
            </li>

            <li class="uk-active">
                <span>{{ current_page }}</span>
            </li>

            <!-- eslint-disable-next-line vue/require-v-for-key-->
            <li v-for="page in after">
                <a @click="selectPage(page)">{{ page }}</a>
            </li>
            <li v-if="dotsAfter" class="uk-disabled">
                <span>...</span>
            </li>

            <li v-if="last">
                <a @click="selectPage(last)">{{ last }}</a>
            </li>
            <li v-if="next">
                <a @click="selectPage(next)"><span uk-pagination-next></span></a>
            </li>
        </ul>
    </div>
</template>
<script>

export default {

    name: 'UiPagination',

    props: {
        pagination: {type: Object, default: () => ({current_page: 0, last_page: 0, total: 0,}),},
        onEachSide: {type: Number, default: 1,},
    },

    computed: {
        current_page() {
            return this.pagination.current_page;
        },
        last_page() {
            return this.pagination.last_page;
        },
        previous() {
            return this.current_page > 1 ? this.current_page - 1 : null;
        },
        next() {
            return this.current_page < this.last_page ? this.current_page + 1 : null;
        },
        first() {
            return this.current_page > 1 ? 1 : null;
        },
        last() {
            return this.current_page < this.last_page ? this.last_page : null;
        },
        before() {
            const pages = [];
            for (let i = 1; i <= this.onEachSide; i++) {
                const prev = this.current_page - i;
                if (prev > 1) {
                    pages.push(prev);
                }
            }
            return pages.reverse();
        },
        after() {
            const pages = [];
            for (let i = 1; i <= this.onEachSide; i++) {
                const next = this.current_page + i;
                if (next < this.last_page) {
                    pages.push(next);
                }
            }
            return pages;
        },
        dotsBefore() {
            return this.current_page > (this.onEachSide + 2);
        },
        dotsAfter() {
            return this.current_page < (this.last_page - (this.onEachSide + 1));
        },
    },

    methods: {
        selectPage(page) {
            this.$emit('pagination:nav', page);
        },
    },
};

</script>
