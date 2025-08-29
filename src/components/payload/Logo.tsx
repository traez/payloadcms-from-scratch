import React from 'react'
import logolight from '@/assets/logolight.png' // Make sure you have your correct images referenced here
import logodark from '@/assets/logodark.png' // Make sure you have your correct images referenced here
import Image from 'next/image'

export default function Logo() {
  return (
    <div>
      <Image className="h-20 object-contain dark:hidden" src={logolight} alt="" /> // This
      determines which logo would show based on user settings
      <Image className="h-20 object-contain hidden dark:block" src={logodark} alt="" />
    </div>
  )
}
