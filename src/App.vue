<template>
    <div id="app">
        <div class="uk-section uk-section-default">
            <h1>Probeer de DigiFundManager Online</h1>
            <div class="uk-container">
                <div uk-grid>
                    <div class="uk-width-2-3@s">
                        <p>Vul de parameters in</p>
                        <p>
                            <button type="button" @click="generate"
                                    class="uk-button uk-button-primary">Nu Berekenen</button>
                        </p>

                        <div v-if="files_received" class="uk-margin uk-grid-small uk-child-width-1-3@s" uk-grid>
                            <div><img :src="imageSources['sample_1.png']" alt="sample 1"/></div>
                            <div><img :src="imageSources['sample_2.png']" alt="sample 2"/></div>
                            <div><img :src="imageSources['sample_3.png']" alt="sample 3"/></div>
                        </div>
                    </div>
                    <div class="uk-width-1-3@s">
                        <p>Wacht op uw berekening</p>
                        <h3>{{ preview_id }}</h3>
                        <p>{{ status }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /* external UIkit */
    const {ajax,} = UIkit.util;

    export default {

        name: 'App',

        data: () => ({
            server_url: 'http://api.dfm.nl/dfm-api/index.php',
            polling_interval: 5000,
            files_received: false,
            params: {},
            options: {},
            status: '',
            preview_id: '',
            files: {},
        }),

        computed: {
            imageSources() {
                const sources = {};
                Object.keys(this.files).forEach(filename => sources[filename] = `data:image/png;base64,${this.files[filename]}`);
                return sources;
            },
        },

        methods: {
            generate() {
                ajax(`${this.server_url}/generate`, {
                    method: 'post',
                    responseType: 'json',
                    body: {...this.params, ...this.options},
                })
                    .then(({response: {preview_id, result, error,},}) => {
                        if (result) {
                            this.preview_id = preview_id;
                            this.startPolling();
                        } else {
                            this.error(error);
                        }
                    });
            },
            startPolling() {
                this.files_received = false;
                this.status = 'pending';
                let interval = setInterval(() => {
                    if (!this.files_received) {
                        this.poll();
                    } else {
                        clearInterval(interval);
                    }
                }, this.polling_interval)
            },
            poll() {
                if (!this.preview_id || this.files_received) {
                    return;
                }
                ajax(`${this.server_url}/preview/${this.preview_id}`, {responseType: 'json',})
                    .then(({response: {status, error, files,}}) => {
                        this.status = status;
                        if (status === 'received') {
                            this.files = files;
                            this.files_received = true;
                        }
                    });
            },
            error(error) {
                //todo
                console.error(error);
            },
        },
    }
</script>

<style>

</style>
