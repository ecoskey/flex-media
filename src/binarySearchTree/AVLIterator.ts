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

    next(): IteratorResult<KVP<K, V[]>, undefined> {
        switch (this.#direction) {
            case 'ascending': {
                if (this.#current === this.#root.max) {
                    return {
                        value: undefined,
                        done: true,
                    };
                }

                if (this.#current.rightNode) {
                    const newCurrent: AVLNode<K, V> = this.#current.rightNode.min;
                    this.#current = newCurrent;
                    return {
                        value: {
                            key: newCurrent.key,
                            value: newCurrent.values,
                        },
                        done: false,
                    };
                }

                let searchNode: AVLNode<K, V> = this.#current;
                while (searchNode.parent) {
                    const parentRightNode = searchNode.parent.rightNode;
                    if (parentRightNode && parentRightNode !== searchNode) {
                        const newCurrent: AVLNode<K, V> = parentRightNode.min;
                        this.#current = newCurrent;
                        return {
                            value: {
                                key: newCurrent.key,
                                value: newCurrent.values,
                            },
                            done: false,
                        };
                    }
                    searchNode = searchNode.parent;
                }
                break;
            }
            case 'descending': {
                if (this.#current === this.#root.min) {
                    return {
                        value: undefined,
                        done: true,
                    };
                }

                if (this.#current.leftNode) {
                    const newCurrent: AVLNode<K, V> = this.#current.leftNode;
                    this.#current = newCurrent;
                    return {
                        value: {
                            key: newCurrent.key,
                            value: newCurrent.values,
                        },
                        done: false,
                    };
                }

                let searchNode: AVLNode<K, V> = this.#current;
                while (searchNode.parent) {
                    const parentLeftNode = searchNode.parent.leftNode;
                    if (parentLeftNode && parentLeftNode !== searchNode) {
                        const newCurrent: AVLNode<K, V> = parentLeftNode.max;
                        this.#current = newCurrent;
                        return {
                            value: {
                                key: newCurrent.key,
                                value: newCurrent.values,
                            },
                            done: false,
                        };
                    }
                    searchNode = searchNode.parent;
                }
                break;
            }
        }
        return { // this should never happen, as all cases are covered in the switch statmeent
            value: undefined,
            done: true,
        };
    }
}