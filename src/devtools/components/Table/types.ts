export interface Column<T = any> {
    title: string
    field: string | ((item: T) => string)
    width?: string
}

export interface ColumnForRow {
    fieldValueResolver: string[] | ((item: any) => string)
}
