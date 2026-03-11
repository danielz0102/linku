export type FilterOperator = "eq" | "ilike"

export type FilterType = "AND" | "OR"

export class Filter {
  constructor(
    public readonly field: string,
    public readonly operator: FilterOperator,
    public readonly value: string
  ) {}
}

export class Criteria {
  public readonly filters: readonly Filter[]
  public readonly filterType: FilterType
  public readonly limit: number | undefined
  public readonly offset: number | undefined

  constructor({
    filters,
    filterType = "AND",
    limit,
    offset,
  }: {
    filters: Filter[]
    filterType?: FilterType
    limit?: number
    offset?: number
  }) {
    this.filters = filters
    this.filterType = filterType
    this.limit = limit
    this.offset = offset
  }
}
