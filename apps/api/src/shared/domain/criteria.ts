export type FilterOperator = "EQ" | "ILIKE"

export type FilterValue<T> =
  | T
  | {
      value: T
      op?: FilterOperator
    }

export type CriteriaConjunction = "AND" | "OR"

export type Criteria<TFilters> = {
  filters?: Partial<{ [K in keyof TFilters]: FilterValue<TFilters[K]> }>
  mode?: CriteriaConjunction
  limit?: number
  offset?: number
}
