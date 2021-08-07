import AVLTree from './binarySearchTree/AVLTree';
import Timeline from './main/Timeline';
import { KVP } from './util/KeyValuePair';

export default Timeline;

function generateRandomKVPArray(length: number): KVP<number, number[]>[] {
    const arrayToReturn: KVP<number, number[]>[] = [];

    for (let i = 0; i < length; i++) {
        const randomKey: number = Math.round(Math.random() * 10000);
        const randomValue: number = Math.round(Math.random() * 10000);
        const randomValue2: number = Math.round(Math.random() * 10000);

        arrayToReturn.push({
            key: randomKey,
            value: [randomValue, randomValue2],
        });
    }

    return arrayToReturn;
}

const randomArray = generateRandomKVPArray(1000);

const time1 = new Date().getTime();
const testTree: AVLTree<number, number> = new AVLTree<number, number>((a, b) => {
    if (a === b) {
        return 'EQ'; 
    } else if (a > b) {
        return 'GT'; 
    } else if (a < b) {
        return 'LT';
    }
    console.log('number equality is being dummbbbbbbb');
    return 'GT';
}, randomArray);
const time2 = new Date().getTime();

console.log(testTree.verify(), `${time2 - time1}ms.`);

const time3 = new Date().getTime();
const arraything = [...testTree];
const time4 = new Date().getTime();
console.log(arraything, `time taken: ${time4 - time3}ms.`);

