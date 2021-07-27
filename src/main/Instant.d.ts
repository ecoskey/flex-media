// an object representing an instant in time, and whatever is occurring at that point in time
export interface Instant<TEvent> {
    time: number; // time in milliseconds
    event: TEvent; // thing that happens at that time
}