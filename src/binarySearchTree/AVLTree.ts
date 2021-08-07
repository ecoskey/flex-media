import AVLNode from './AVLNode';
import { CompareFunc } from '../util/CompareFunc';
import { KVP } from '../util/KeyValuePair';
import AVLIterator from './AVLIterator';

// implemented as a variety of Self Balancing Binary Search Tree called an AVL Tree
export default class AVLTree<K, V> /*implements Iterable<KVP<K, V[]>>*/{
    readonly #compareFunc: CompareFunc<K>;
    #root?: AVLNode<K, V>;

    public constructor(compareFunc: CompareFunc<K>, initialItems?: Iterable<KVP<K, V[]>> | null | undefined) {
        this.#compareFunc = compareFunc;

        if (initialItems) {
            for (const item of initialItems) {
                this.insert(item.key, ...item.value);
            }
        }
    }

    public verify(): boolean {
        return this.#root?.verify() ?? false;
    }

    public get(key: K): KVP<K, V[]> | undefined {
        return this.#root?.get(key);
    }

    /*public search(key: K): KVP<K, V[]> | undefined {
        //to be implemented
    } */

    public getMin(): KVP<K, V[]> | undefined {
        const minNode =  this.#root?.min;

        if (minNode) {
            return {
                key: minNode.key,
                value: minNode.values,
            };
        }
        return undefined;
    }

    public getMax(): KVP<K, V[]> | undefined {
        const maxNode =  this.#root?.max;

        if (maxNode) {
            return {
                key: maxNode.key,
                value: maxNode.values,
            };
        }
        return undefined;
    }

    public insert(key: K, ...items: V[]): void {
        if (items.length > 0) {
            this.#root = this.#root?.insert(key, ...items)[0] ?? new AVLNode<K, V>(key, this.#compareFunc, undefined, items);
        }
    }

    /*public delete(key: K): void {
        this.#root = this.#root?.delete(key);
    }*/

    public clear(): void {
        this.#root = undefined;
    }

    [Symbol.iterator](): Iterator<KVP<K, V[]>> {
        if (!this.#root) { // makes a default (empty) iterator if there is no root node
            return {
                next() {
                    return {
                        value: undefined,
                        done: true,
                    };
                }
            };
        }

        return new AVLIterator(this.#root, 'descending');
    }
}