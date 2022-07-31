export const DragItemTypes = {
    REQUEST: 'REQUEST',
}

export interface DropContext<T extends object> {
    onDropCompleted: (item: T) => void;
}
