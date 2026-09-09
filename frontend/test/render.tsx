import { ThemeProvider } from '@mui/material'
import { render as rtlRender } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { theme } from '../src/99-design/theme'

export const render = (ui: ReactElement): RenderResult =>
  rtlRender(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </MemoryRouter>
    ),
  })
