import { usersTable } from "#shared/db/drizzle/schemas.js"
import type { Criteria } from "#shared/domain/criteria.js"
import { and, eq, ilike, or, type SQL } from "drizzle-orm"

export class CriteriaToDrizzleConverter {
  convert(criteria: Criteria): {
    where: SQL | undefined
    limit: number | undefined
    offset: number | undefined
  } {
    const conditions = criteria.filters.reduce<SQL[]>((acc, filter) => {
      if (!(filter.field in usersTable)) {
        throw new Error(`Invalid filter field: "${filter.field}"`)
      }

      const column = usersTable[filter.field as keyof typeof usersTable]

      if (filter.operator === "eq") {
        acc.push(eq(column as Parameters<typeof eq>[0], filter.value))
      } else if (filter.operator === "ilike") {
        acc.push(ilike(column as Parameters<typeof ilike>[0], `%${filter.value}%`))
      }

      return acc
    }, [])

    const where =
      conditions.length === 0
        ? undefined
        : criteria.filterType === "OR"
          ? or(...conditions)
          : and(...conditions)

    return { where, limit: criteria.limit, offset: criteria.offset }
  }
}
