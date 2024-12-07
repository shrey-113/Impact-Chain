import NgoSidebar from './ui/NgoSidebar'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'


export default function Layout() {

  

  return (
    <div>
      <div className='flex flex-row h-screen w-screen '>
        <div className='flex flex-col h-screen w-screen '>
        <Navbar  />
          <NgoSidebar/>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}