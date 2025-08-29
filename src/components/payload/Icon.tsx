import React from 'react'
import icon from '@/assets/icon.png' // Make sure you have your correct image referenced here
import Image from 'next/image'

export default function Icon() {
  return (
    <div>
      <Image className="w-40" src={icon} alt="" /> // Note that we don't have a dark mode version
      because the icon is red
    </div>
  )
}
