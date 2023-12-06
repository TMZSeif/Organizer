import './App.css'
import Home from './pages/Home'
import CreateChapterPage from './pages/CreateChapterPage'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import ChapterPage from './pages/ChapterPage'
import EditChaptersPage from './pages/EditChaptersPage'
import EditChapterPage from './pages/EditChapterPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import LogoutPage from './pages/LogoutPage'
import ActivateAccountNoticePage from './pages/ActivateAccountNoticePage'
import ActivateAccountPage from './pages/ActivateAccountPage'
import UserProfilePage from './pages/UserProfilePage'
import EditAccountPage from './pages/EditAccountPage'
import ChangeEmailPage from './pages/ChangeEmailPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import VerifyPasswordChangeNoticePage from './pages/VerifyPasswordChangeNoticePage'
import VerifyPasswordChangePage from './pages/VerifyPasswordChangePage'
import ResetPasswordNoticePage from './pages/ResetPasswordNoticePage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/create" element={<CreateChapterPage />} />
        <Route path="/chapter/:id" element={<ChapterPage />} />
        <Route exact path="/chapters" element={<EditChaptersPage />} />
        <Route path="/chapters/:id/update" element={<EditChapterPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route exact path="/activate" element={<ActivateAccountNoticePage />} />
        <Route path="/activate/:uidb64/:token" element={<ActivateAccountPage />} />
        <Route exact path="/user" element={<UserProfilePage />} />
        <Route path="/user/edit" element={<EditAccountPage />} />
        <Route path="/user/change-email" element={<ChangeEmailPage />} />
        <Route path="/user/change-password" element={<ChangePasswordPage />} />
        <Route exact path="/verify" element={<VerifyPasswordChangeNoticePage />} />
        <Route path="/verify/:uidb64/:token" element={<VerifyPasswordChangePage />} />
        <Route exact path="/reset" element={<ResetPasswordNoticePage />} />
        <Route path="/reset/:uidb64/:token" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
