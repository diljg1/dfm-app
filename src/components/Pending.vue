<template>

    <div>
        <p>{{ 'Wacht op uw berekening' | trans }}</p>
        <h3>{{ preview_id }}</h3>
        <h3>{{ currentPreviewStatus }}</h3>
        <p v-if="rangedTimeWaiting">{{ rangedTimeWaiting }} seconds</p>

        <div v-if="currentPreviewExpired">
            <p>{{ 'Dit lijkt te lang te duren.' | trans }}</p>
            <p>
            </p>
        </div>
    </div>

</template>
<script>
import {mapGetters, mapState,} from 'vuex';

export default {

    name: 'Pending',

    computed: {
        rangedTimeWaiting() {
            if (this.pendingTime > 90) {
                return 90;
            } else if (this.pendingTime > 70) {
                return 70;
            } else if (this.pendingTime > 50) {
                return 50;
            } else if (this.pendingTime > 30) {
                return 30;
            } else if (this.pendingTime > 20) {
                return 20;
            } else if (this.pendingTime > 10) {
                return 10;
            }
            return 0;
        },
        ...mapState({
            preview_id: state => state.preview.preview_id,
            timestamp: state => state.preview.timestamp,
            last_poll_time: state => state.last_poll_time,
        }),
        ...mapGetters(['currentPreviewStatus', 'currentPreviewExpired', 'pendingTime',]),
    },
}

</script>