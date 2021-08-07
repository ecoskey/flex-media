import { CompareFunc, CompareResult } from '../util/CompareFunc';
import { KVP } from '../util/KeyValuePair';

export default class AVLNode<K, V> {
    readonly #key: K;
    readonly #values: V[];
    readonly #compareFunc: CompareFunc<K>;

    #balanceFactor: number;

    #parent?: AVLNode<K, V>
    #leftNode?: AVLNode<K, V>; // key should always be less than this.#key
    #rightNode?: AVLNode<K, V>; // key should always be greater than this.#key  

    constructor(key: K, compareFunc: CompareFunc<K>, initialParent?: AVLNode<K, V>, initialItems?: Iterable<V> | null | undefined) {
        this.#key = key;
        this.#values = [...(initialItems ?? [])];
        this.#compareFunc = compareFunc;

        this.#balanceFactor = 0;

        this.#parent = initialParent;
    }

    verify(): boolean { // to be removed later
        const greaterThanLeft: boolean = this.#leftNode !== undefined ? this.#key > this.#leftNode.#key : true;
        const lessThanRight: boolean = this.#rightNode !== undefined ? this.#key < this.#rightNode.#key : true;

        return greaterThanLeft && lessThanRight && (this.#leftNode?.verify() ?? true) && (this.#rightNode?.verify() ?? true) && Math.abs((this.#rightNode?.height ?? 0) - (this.#leftNode?.height ?? 0)) <= 1;
    }

    get key(): K {
        return this.#key;
    }

    get height(): number { // to be removed later
        return Math.max(this.leftNode?.height ?? 0, this.#rightNode?.height ?? 0) + 1;
    }
    
    get values(): V[] {
        return this.#values;
    }

    get kvp(): KVP<K, V[]> {
        return {
            key: this.#key,
            value: this.#values,
        };
    }

    get balanceFactor(): number {
        return this.#balanceFactor;
    }

    set balanceFactor(newBalanceFactor: number) {
        this.#balanceFactor = newBalanceFactor;
    }

    get parent(): AVLNode<K, V> | undefined {
        return this.#parent;
    }

    set parent(newParent: AVLNode<K, V> | undefined) {
        this.#parent = newParent;
    }

    get leftNode(): AVLNode<K, V> | undefined {
        return this.#leftNode;
    }

    set leftNode(newLeft: AVLNode<K, V> | undefined) { //ONLY to be used in the rotation methods
        this.#leftNode = newLeft;
    }

    get rightNode(): AVLNode<K, V> | undefined {
        return this.#rightNode;
    }

    set rightNode(newRight: AVLNode<K, V> | undefined) { //ONLY to be used in the rotation methods
        this.#rightNode = newRight; 
    }

    get min(): AVLNode<K, V> {
        return this.#leftNode?.min ?? this;
    }

    get max(): AVLNode<K, V> {
        return this.#rightNode?.max ?? this;
    }

    get(key: K): KVP<K, V[]> | undefined {
        const compareResult: CompareResult = this.#compareFunc(key, this.#key);

        switch (compareResult) {
            case 'EQ': {
                return this.kvp;
            }
            case 'GT': {
                return this.#rightNode?.get(key);
            }
            case 'LT': {
                return this.#leftNode?.get(key);
            }
        }
    }

    /*public search(key: K): KVP<K, V[]> {
        //to be implemented
    }*/

    insert(key: K, ...items: V[]): [AVLNode<K, V>, number] /* new root node, after possible tree rotations, change in height of the tree */ {
        if (items.length === 0) { return [this, 0]; }

        const compareResult: CompareResult = this.#compareFunc(key, this.#key);

        let heightDelta = 0;

        switch (compareResult) {
            case 'EQ': {
                this.#values.push(...items);
                return [this, 0];
            }
            case 'GT': {
                let rightHeightDelta;
                [this.#rightNode, rightHeightDelta] = 
                    this.#rightNode?.insert(key, ...items) ?? 
                    [ new AVLNode<K, V>(key, this.#compareFunc, this, items), this.#leftNode ? 0 : 1 ];

                this.#balanceFactor += rightHeightDelta;

                if (this.#balanceFactor > 0) { heightDelta = rightHeightDelta; } // height of this tree doesn't change unless the updated subtree is now the highest. (if this tree is now that-side heavy)
                break;
            }
            case 'LT': {
                let leftHeightDelta;
                [this.#leftNode, leftHeightDelta] =
                    this.#leftNode?.insert(key, ...items) ?? 
                    [ new AVLNode<K, V>(key, this.#compareFunc, this, items), this.#rightNode ? 0 : 1 ];

                this.#balanceFactor -= leftHeightDelta;

                if (this.#balanceFactor < 0) { heightDelta = leftHeightDelta; } // height of this tree doesn't change unless the updated subtree is now the highest. (if this tree is now that-side heavy)
                break;
            }

            
        }
        const newNode: AVLNode<K, V> = AVLNode.rebalance(this);
            return [newNode, heightDelta];
    }

    /*public delete(key: K): AVLNode<K, V> | undefined {
        const compareValue: number = this.#compareFunc(key, this.#key);

        let newTree: AVLNode<K, V> | undefined;

        if (compareValue === 0) {
            if (this.#rightNode) {
                if (this.#leftNode) {
                    //pain time - node has two children, have to do some painful things to proceed
                    //TODO: make in order successor finding a call to the common forward iterator (IterableIterator?)
                    const inOrderSuccessor = this.#rightNode.getMinNode();
                    const successorKey = inOrderSuccessor.#key;
                    this.#rightNode = this.#rightNode.delete(successorKey); //this works, because it will only have one right child at most, as the minimum of its subtree
                    
                    [inOrderSuccessor.#rightNode, inOrderSuccessor.#leftNode] = [this.#rightNode, this.#leftNode]; //effectively replace current node with new node
                    
                    newTree = inOrderSuccessor;
                } else {
                    //single replace - right
                    return this.#rightNode;
                }
            } else {
                if (this.#leftNode) {
                    //single replace - left
                    return this.#leftNode;
                } else {
                    //delete target has no child, this tree goes bye bye
                    return undefined;
                }
            }
        } else if (compareValue > 0) {
            newTree = this.#rightNode?.delete(key) ?? this;
        } else {
            newTree = this.#leftNode?.delete(key) ?? this;
        }

        newTree.refreshHeight();
        newTree.refreshBalanceFactor();

        AVLNode.rebalance(newTree);

        newTree.refreshHeight();
        newTree.refreshBalanceFactor();

        return newTree; 
    }*/

    static rebalance<K, V>(tree: AVLNode<K, V>): AVLNode<K, V> {
        // determine what imbalance type the tree has, then fix it :)
        // --> based on what balance factor of current tree and largest child are.
        if (tree.balanceFactor >= 2) {
            console.warn(`my temporary balance factor is: ${tree.balanceFactor}`);
            if ((tree.rightNode as AVLNode<K, V>).balanceFactor >= 0) {
                console.log(`performing a left rotation`);
                return AVLNode.rotateLeft(tree);
            } else {
                console.log(`performing a rightleft rotation`);
                return AVLNode.rotateRightLeft(tree);
            }
        }
        if (tree.balanceFactor <= -2) {
            console.warn(`my temporary balance factor is: ${tree.balanceFactor}`);
            if ((tree.leftNode as AVLNode<K, V>).balanceFactor <= 0) {
                console.log(`performing a right rotation`);
                return AVLNode.rotateRight(tree);
            } else {
                console.log(`performing a leftright rotation`);
                return AVLNode.rotateLeftRight(tree); 
            }
        }
        return tree;
    }

    static rotateRight<K, V>(tree: AVLNode<K, V>): AVLNode<K, V> {
        const newRoot: AVLNode<K, V> = tree.leftNode as AVLNode<K, V>;
        [newRoot.parent, tree.parent] = [tree.parent, newRoot]; // swaps parents
        [newRoot.rightNode, tree.leftNode] = [tree, newRoot.rightNode]; // swaps inner children of each node, almost

        if (newRoot.balanceFactor === 0) {
            newRoot.balanceFactor -= 1;
            newRoot.rightNode.balanceFactor += 1;
        } else {
            newRoot.balanceFactor = 0;
            newRoot.rightNode.balanceFactor = 0;
        }

        console.log(`new root balanceFactor: ${newRoot.balanceFactor} \n new oldRoot balanceFactor: ${newRoot.rightNode.balanceFactor}`);
        

        return newRoot;
    }

    static rotateLeft<K, V>(tree: AVLNode<K, V>): AVLNode<K, V> {
        const newRoot: AVLNode<K, V> = tree.rightNode as AVLNode<K, V>;
        [newRoot.parent, tree.parent] = [tree.parent, newRoot]; // swaps parents
        [newRoot.leftNode, tree.rightNode] = [tree, newRoot.leftNode]; // swaps inner children of each node, almost

        if (newRoot.balanceFactor === 0) {
            newRoot.balanceFactor -= 1;
            newRoot.leftNode.balanceFactor += 1;
        } else {
            newRoot.balanceFactor = 0;
            newRoot.leftNode.balanceFactor = 0;
        }

        console.log(`new root balanceFactor: ${newRoot.balanceFactor} \n new oldRoot balanceFactor: ${newRoot.leftNode.balanceFactor}`);

        return newRoot;
    }

    static rotateRightLeft<K, V>(tree: AVLNode<K, V>): AVLNode<K, V> {
        tree.rightNode = AVLNode.rotateRight(tree.rightNode as AVLNode<K, V>); //rotateRight the right child node
        const newRoot: AVLNode<K, V> = AVLNode.rotateLeft(tree); //rotateLeft the root node

        
        return newRoot;
    }

    static rotateLeftRight<K, V>(tree: AVLNode<K, V>): AVLNode<K, V> {
        tree.leftNode = AVLNode.rotateLeft(tree.leftNode as AVLNode<K, V>); //rotateLeft the left child node
        const newRoot: AVLNode<K, V> = AVLNode.rotateRight(tree); //rotateRight the root node

        return newRoot;
    }
}