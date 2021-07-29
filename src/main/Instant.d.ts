// an object representing an instant in time, and whatever is occurring at that point in time
export interface Instant<TEvent> {
    readonly time: number; // (strictly positive) time in milliseconds
    readonly event: TEvent; // thing that happens at that time
}