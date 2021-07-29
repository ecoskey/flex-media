/*  Function type that compares two values.

*   -> returns a positive number if a is greater than b
*   -> returns 0 if a and b are equal
*   -> returns a negative number if a is less than b
*/   
export type CompareFunc<T> = (a: T, b: T) => number;