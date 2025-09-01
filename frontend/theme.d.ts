import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    size: Size
    precision: Precision
    weight: Weight
  }
  interface ThemeOptions {
    size: Size
    precision: Precision
    weight: Weight
  }
}

// ts-prune-ignore-next
type Size = {
  1: '0.5rem'
  2: '1rem'
  3: '1.5rem'
  4: '2rem'
  5: '2.5rem'
  6: '3rem'
}

// ts-prune-ignore-next
type Precision = {
  1: '1px'
  2: '2px'
  3: '3px'
  4: '4px'
  5: '5px'
  6: '6px'
}

// ts-prune-ignore-next
type Weight = {
  1: 100
  2: 200
  3: 300
  4: 400
  5: 500
  6: 600
}
