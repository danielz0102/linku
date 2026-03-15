export interface TestUserDAO<T> {
  insert(user: T): Promise<void>
  deleteById(id: string): Promise<void>
  findByUsername(username: string): Promise<T | undefined>
}
