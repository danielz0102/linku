import { and, eq, ilike, or } from "drizzle-orm"
import type { AnyColumn, SQL } from "drizzle-orm"

import type {
  Criteria,
  CriteriaConjunction,
  FilterOperator,
  FilterValue,
} from "#shared/domain/criteria.js"

export type CriteriaColumnMap<TFilters> = {
  [K in keyof TFilters]: AnyColumn
}

type NormalizedFilter<T> = {
  value: T
  op: FilterOperator
}

const DEFAULT_MODE: CriteriaConjunction = "AND"
const DEFAULT_OP: FilterOperator = "EQ"

const isOperatorObject = <T>(
  value: FilterValue<T>
): value is { value: T; op?: FilterOperator } =>
  typeof value === "object" && value !== null && "value" in value

const normalizeFilterValue = <T>(value: FilterValue<T>): NormalizedFilter<T> =>
  isOperatorObject(value)
    ? { value: value.value, op: value.op ?? DEFAULT_OP }
    : { value, op: DEFAULT_OP }

export const buildDrizzleWhere = <TFilters>(
  criteria: Criteria<TFilters>,
  columns: CriteriaColumnMap<TFilters>
): SQL => {
  const filters = criteria.filters ?? {}
  const entries = Object.entries(filters) as [
    keyof TFilters,
    FilterValue<TFilters[keyof TFilters]>,
  ][]

  const conditions = entries.flatMap(([key, rawValue]) => {
    if (rawValue === undefined) {
      return []
    }

    const { value, op } = normalizeFilterValue(
      rawValue as FilterValue<TFilters[keyof TFilters]>
    )
    const column = columns[key]

    if (op === "ILIKE") {
      if (typeof value !== "string") {
        throw new Error(
          `ILIKE operator requires a string value for ${String(key)}`
        )
      }
      return [ilike(column, `%${value}%`)]
    }

    return [eq(column, value)]
  })

  if (conditions.length === 0) {
    throw new Error("At least one filter must be provided")
  }

  if (conditions.length === 1) {
    return conditions[0]
  }

  const mode = criteria.mode ?? DEFAULT_MODE

  return mode === "OR" ? or(...conditions) : and(...conditions)
}
