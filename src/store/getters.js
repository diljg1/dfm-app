

export const currentPreview = state => {
    return state.previews[state.preview_id] !== undefined ? state.previews[state.preview_id] : false;
};

export const currentPreviewStatus = state => {
    return state.previews[state.preview_id] !== undefined ? state.previews[state.preview_id].status : '';
};

export const currentPreviewFilesReceived = (state, getters) => getters.previewFilesReceived(state.preview_id);

export const previewFilesReceived = state => preview_id => {
    return state.previews[preview_id] !== undefined ? state.previews[preview_id].status === 'received' : false;
};

export const currentPreviewFiles = state => {
    return state.previews[state.preview_id] !== undefined ? state.previews[state.preview_id].files : {};
};