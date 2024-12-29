import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './Pages/Landing'
import RegisterOrgn from './Pages/RegisterOrgn'
import OrganizationLogin from './Pages/OrganizationLogin'
import OrgaizationProfile from './Pages/OrgaizationProfile'
import MemberLogin from './Pages/MemberLogin'
import MemberProfile from './Pages/MemberProfile'
import Explore from './Pages/Explore'
import Organization from './Pages/Organization'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/Register-Organization" element={<RegisterOrgn/>}/>
        <Route path="/Organization-Login" element={<OrganizationLogin/>}/>
        <Route path="/Oganization-Profile/:Id" element={<OrgaizationProfile/>}/>
        <Route path="/Member-Login" element={<MemberLogin/>}/>
        <Route path="/Profile/:Id" element={<MemberProfile/>}/>
        <Route path="/Explore" element={<Explore/>}/>
        <Route path="/All-Organization" element={<Organization/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App