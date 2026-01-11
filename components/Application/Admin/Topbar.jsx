import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropdown from './UserDropdown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className='fixed border h-14 w-full top-0 left-0 z-30 md:ps-64 md:pe-8 flex justify-between items-center bg-white dark:bg-card'>
        {/* search */}
      <div></div>
      {/* theme switch */}
      <div className='flex items-center gap-2'>
        <ThemeSwitch/>
        <UserDropdown/>
        <Button type="button" size='icon' className="ms-2 cursor-pointer">
            <RiMenu4Fill/>
        </Button>
      </div>
    </div>
  )
}

export default Topbar
