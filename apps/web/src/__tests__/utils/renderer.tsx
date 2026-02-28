import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, type RenderResult } from "@testing-library/react"
import type React from "react"
import { MemoryRouter } from "react-router"
import type { LinkuAPI } from "@linku/api-contract"
import { AuthContext } from "~/auth/context/auth-context"

type Wrapper = React.ComponentType<React.PropsWithChildren>

export class Renderer {
  private Wrapper: Wrapper | null = null

  render(component: React.ReactElement): RenderResult {
    if (!this.Wrapper) {
      return render(component)
    }

    return render(<this.Wrapper>{component}</this.Wrapper>)
  }

  withRouter(): Renderer {
    this.setNewWrapper(({ children }) => (
      <MemoryRouter>{children}</MemoryRouter>
    ))
    return this
  }

  withQueryProvider(): Renderer {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    this.setNewWrapper(({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ))
    return this
  }

  withAuthProvider(user: LinkuAPI.PublicUser | null = null): Renderer {
    this.setNewWrapper(({ children }) => (
      <AuthContext
        value={{
          user,
          async login(_credentials: LinkuAPI.Login["RequestBody"]) {},
          async register(_newUser: LinkuAPI.RegisterUser["RequestBody"]) {},
          async logout() {},
        }}
      >
        {children}
      </AuthContext>
    ))
    return this
  }

  private setNewWrapper(NewWrapper: Wrapper): void {
    if (!this.Wrapper) {
      this.Wrapper = NewWrapper
      return
    }

    const PreviousWrapper = this.Wrapper

    this.Wrapper = ({ children }) => (
      <NewWrapper>
        <PreviousWrapper>{children}</PreviousWrapper>
      </NewWrapper>
    )
  }
}
