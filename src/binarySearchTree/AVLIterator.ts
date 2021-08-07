import AVLNode from './AVLNode';
import { KVP } from '../util/KeyValuePair';

export type IteratorDirection = 'ascending' | 'descending';

export default class AVLIterator<K, V> implements Iterator<KVP<K, V[]>> {
    readonly #root: AVLNode<K, V>;
    readonly #direction: IteratorDirection;
    #current: AVLNode<K, V>;
    
    constructor (tree: AVLNode<K, V>, direction: IteratorDirection) {
        this.#root = tree;
        this.#direction = direction;
        this.#current = tree.getMinNode();
    }

    get direction(): IteratorDirection {
        return this.#direction;
    }

    get current(): KVP<K, V[]> {
        return {
            key: this.#current.key,
            value: this.#current.values,
        };
    }

    next() {
        switch (this.#direction) {
            case 'ascending':
                

            
                break;
            case 'descending':



                break;
        }
    }
}