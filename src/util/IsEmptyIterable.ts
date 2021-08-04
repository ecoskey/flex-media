export default function isEmptyIterable(iterable: Iterable<unknown>): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of iterable) {
        return false;
    }

    return true;
}