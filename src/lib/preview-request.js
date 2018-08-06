

class PreviewRequest {

    constructor(preview_id, params, options) {
        this.preview_id = preview_id;
        this.params = params;
        this.options = options;
        this.status = 'pending';
        this.files = {};
    }
}


export default PreviewRequest;