export interface TestUserDAO<T> {
  insert(user: T): Promise<void>
  deleteById(id: string): Promise<void>
}
