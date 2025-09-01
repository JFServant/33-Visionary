import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import DetectionScreen from './detection/screen'
import Guard from './global/guard'
import IdentityScreen from './identity/screen'
import SignupComponent from './identity/signup/component'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/identity" element={<IdentityScreen />}>
        <Route index element={<Navigate to="signup" replace />} />
        <Route path="signup" element={<SignupComponent />} />
      </Route>

      <Route element={<Guard />}>
        <Route path="/detection" element={<DetectionScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/identity" replace />} />
    </Routes>
  </BrowserRouter>
)

export default App
