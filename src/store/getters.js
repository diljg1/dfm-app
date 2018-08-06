

export const currentPreview = state => {
    return state.previewrequests[state.preview_id] !== undefined ? state.previewrequests[state.preview_id] : false;
};

export const currentPreviewStatus = state => {
    return state.previewrequests[state.preview_id] !== undefined ? state.previewrequests[state.preview_id].status : '';
};

export const currentPreviewFilesReceived = (state, getters) => getters.previewFilesReceived(state.preview_id);

export const previewFilesReceived = state => preview_id => {
    return state.previewrequests[preview_id] !== undefined ? state.previewrequests[preview_id].status === 'received' : false;
};

export const currentPreviewFiles = state => {
    return state.previewrequests[state.preview_id] !== undefined ? state.previewrequests[state.preview_id].files : {};
};