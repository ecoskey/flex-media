import AVLNode from './AVLNode';
import { KVP } from '../util/KeyValuePair';

export type IteratorDirection = 'ascending' | 'descending';

export default class AVLIterator<K, V> implements Iterator<KVP<K, V[]>> {
    readonly #root: AVLNode<K, V>;
    readonly #direction: IteratorDirection;
    #current: AVLNode<K, V>;
    #returnedFirst: boolean;
    
    constructor (tree: AVLNode<K, V>, direction: IteratorDirection) {
        this.#root = tree;
        this.#direction = direction;
        switch (direction) {
            case 'ascending': {
                this.#current = tree.min;
                break;
            }
            case 'descending': {
                this.#current = tree.max;
                break;
            }
        }
        this.#returnedFirst = false;
    }

    get current(): KVP<K, V[]> {
        return this.#current.kvp;
    }

    get direction(): IteratorDirection {
        return this.#direction;
    }

    next(): IteratorResult<KVP<K, V[]>> {
        if (!this.#returnedFirst) {
            this.#returnedFirst = true;
            return {
                value: this.#current.kvp,
                done: false,
            };
        }

        switch (this.#direction) {
            case 'ascending': {
                const successor: AVLNode<K, V> | undefined = this.#current.successor;
                if (successor) {
                    this.#current = successor;
                    return {
                        value: successor.kvp,
                        done: false,
                    };
                } else {
                    return {
                        value: undefined,
                        done: true,
                    };
                }
            }
            case 'descending': {
                const predecessor: AVLNode<K, V> | undefined = this.#current.predecessor;
                if (predecessor) {
                    this.#current = predecessor;
                    return {
                        value: predecessor.kvp,
                        done: false,
                    };
                } else {
                    return {
                        value: undefined,
                        done: true,
                    };
                }
            }
        }
    }
}