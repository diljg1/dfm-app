<template>

    <div>
        <template v-if="!currentPreviewStatus">
            <p>{{ 'Pas de waarden hiernaast aan naar uw persoonlijke situatie.' | trans }}</p>
        </template>
        <template v-if="currentPreviewStatus === 'pending'">

            <h3>{{ 'Wacht op uw berekening' | trans }}</h3>

            <div uk-grid>
                <div class="uk-width-3-4@m">
                    <p v-if="timeWaiting.messageId">{{ timeWaiting.messageId | trans }}</p>
                </div>
                <div class="uk-width-1-4@m">
                    <img src="images/placeholder.png" alt="sample_1"/>
                </div>
            </div>


        </template>

        <div v-if="currentPreviewExpired">
            <p>{{ 'Dit lijkt te lang te duren.' | trans }}</p>
        </div>
    </div>

</template>
<script>
import {mapGetters, mapState,} from 'vuex';
import {PENDING_MESSAGES_INTERVALS,} from '../../config';

export default {

    name: 'Pending',

    computed: {
        timeWaiting() {
            let rangedTime = 0;
            let messageId = '';
            const nrIntervals = PENDING_MESSAGES_INTERVALS.length;
            for (let index = 0; index < nrIntervals; index++) {
                if (this.pendingTime > PENDING_MESSAGES_INTERVALS[index]) {
                    rangedTime = PENDING_MESSAGES_INTERVALS[index];
                    messageId = `pending_message_${nrIntervals - index}`;
                    break;
                }
            }
            return {rangedTime, messageId};
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