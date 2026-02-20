import type {
  LoginBody,
  RegistrationBody as NewUser,
  PublicUser as User,
} from "api-contract"
import { apiClient } from "~/shared/api"

export const AuthService = {
  async login(credentials: LoginBody): Promise<User> {
    return apiClient
      .post<User>("/users/login", credentials)
      .then(({ data }) => data)
  },

  async register(newUser: NewUser): Promise<User> {
    return apiClient.post<User>("/users", newUser).then(({ data }) => data)
  },

  async logout(): Promise<void> {
    apiClient.post("/users/logout")
  },

  async getMe(): Promise<User | null> {
    return apiClient
      .get<User>("/users/me")
      .then(({ data }) => data)
      .catch(() => null)
  },
}
