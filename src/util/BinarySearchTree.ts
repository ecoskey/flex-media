import BSTNode from './BSTNode';
import { CompareFunc } from './CompareFunc';

// implemented as a variety of Self Balancing Binary Search Tree called an AVL Tree
export default class BinarySearchTree<T> implements Iterable<T> {
    readonly #compareFunc: CompareFunc<T>;
    #root?: BSTNode<T>;

    public constructor(compareFunc: CompareFunc<T>, initialItems?: Iterable<T>) {
        this.#compareFunc = compareFunc;

        if (initialItems !== undefined) {
            // initialize BST by iterating through initialItems
            for (const item of initialItems) {
                // insert item into BST
            }
        }
    }

    public insert(item: T): void {
        if (this.#root !== undefined) {
            this.#root = this.#root?.insert(item);
        } else {
            this.#root = new BSTNode<T>(item, this.#compareFunc);
        }
    }

    /*[Symbol.iterator](): Iterator<T> {
        return {
            //return iterator here
        }
    }*/
}