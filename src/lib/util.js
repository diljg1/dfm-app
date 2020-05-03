export function arrayWithReplacedItem(array, index, item) {
    const copy = array.slice();
    copy.splice(index, 1, item);
    return copy;
}
export function arrayWithRemovedItem(array, index) {
    const copy = array.slice();
    copy.splice(index, 1);
    return copy;
}
