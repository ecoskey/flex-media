import { CompareFunc } from './CompareFunc';

export default class BSTNode<T> {
    readonly #value: T;
    readonly #compareFunc: CompareFunc<T>;

    #balanceFactor: number;
    #height: number;

    #parent?: BSTNode<T>;

    #leftNode?: BSTNode<T>; // value should always be less than this.#value
    #rightNode?: BSTNode<T>; // value should always be greater than this.#value

    public constructor(value: T, compareFunc: CompareFunc<T>, initialParent?: BSTNode<T>) {
        this.#value = value;
        this.#compareFunc = compareFunc;

        this.#balanceFactor = 0;
        this.#height = 0;

        this.#parent = initialParent;

        this.#leftNode = undefined;
        this.#rightNode = undefined;
    }

    get value(): T {
        return this.#value;
    }

    get balanceFactor(): number {
        return this.#balanceFactor;
    }

    get height(): number {
        return this.#height;
    }

    get parent(): BSTNode<T> | undefined {
        return this.#parent;
    }

    get leftNode(): BSTNode<T> | undefined {
        return this.#leftNode;
    }

    get rightNode(): BSTNode<T> | undefined {
        return this.#rightNode;
    }

    public insert(item: T): BSTNode<T> /* new root node, after possible tree rotations */ {
        const compareValue: number = this.#compareFunc(this.#value, item);
        if (compareValue >= 0) {
            if (this.#leftNode !== undefined) {
                this.#leftNode = this.#leftNode.insert(item);
            } else {
                this.#leftNode = new BSTNode<T>(item, this.#compareFunc);
            }
        } else {
            if (this.#rightNode !== undefined) {
                this.#rightNode = this.#rightNode.insert(item);
            } else {
                this.#rightNode = new BSTNode<T>(item, this.#compareFunc);
            }
        }

        this.refreshHeight();
        this.refreshBalanceFactor();

        //additional logic to assign height, retrace and rotate tree to maintain balance

    }

    private refreshHeight(): void {
        this.#height = Math.max(this.#rightNode?.height ?? 0, this.#leftNode?.height ?? 0) + 1;
    }

    private refreshBalanceFactor(): void {
        this.#balanceFactor = (this.#rightNode?.height ?? 0) - (this.#leftNode?.height ?? 0);
    }
}