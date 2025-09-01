import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import GuardScreen from './global/guard/screen'
import LoginComponent from './identity/login/component'
import IdentityScreen from './identity/screen'
import SignupComponent from './identity/signup/component'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/identity" element={<IdentityScreen />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="signup" element={<SignupComponent />} />
        <Route path="login" element={<LoginComponent />} />
      </Route>

      <Route path="/detection" element={<GuardScreen />} />

      <Route path="*" element={<Navigate to="/identity" replace />} />
    </Routes>
  </BrowserRouter>
)

export default App
