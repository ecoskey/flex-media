import AVLIterator from '../binarySearchTree/AVLIterator';
import AVLTree from '../binarySearchTree/AVLTree';
import { KVP } from '../util/KeyValuePair';
import compareNums from './compareNums';
import { Marker } from './Marker';

export default class Timeline<TTimelineEvent> {
    readonly #timelineData: AVLTree<number, TTimelineEvent>;
    #timelineIterator: Iterator<KVP<number, TTimelineEvent[]>>;

    #currentStartTime: number;
    #currentTime: number;
    #paused: boolean;
    #reversed: boolean;

    readonly #markers: Marker[];

    constructor(initialItems?: Iterable<KVP<number, TTimelineEvent[]>> | null | undefined) {
        this.#timelineData = new AVLTree<number, TTimelineEvent>(compareNums, initialItems);
        this.#timelineIterator = this.#timelineData.entries();

        this.#currentStartTime = performance.now();
        this.#currentTime = this.#currentStartTime;
        this.#paused = false;

        this.#markers = [];
    }
    //oh boy
    //how to API :thonk:
} 