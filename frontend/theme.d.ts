import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    size: Size
    precision: Precision
    weight: Weight
    gradient: Gradient
  }
  interface ThemeOptions {
    size: Size
    precision: Precision
    weight: Weight
    gradient: Gradient
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

// ts-prune-ignore-next
type Gradient = {
  top: 'linear-gradient(to top, #6a5af9, #00d4ff, #ff4dd2)'
  right: 'linear-gradient(to right, #6a5af9, #00d4ff, #ff4dd2)'
  bottom: 'linear-gradient(to bottom, #6a5af9, #00d4ff, #ff4dd2)'
  left: 'linear-gradient(to left, #6a5af9, #00d4ff, #ff4dd2)'
}
