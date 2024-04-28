import Logo from '@/components/navbar/logo/page'
import Link from 'next/link'
import Links from './links/Links'

export default function Navbar() {
  return (
    <>
    <div className='bg-black flex justify-between items-center text-white pl-2 pr-2 h-20 fixed top-0 left-0 right-0 z-10 '>
      <div>
        <Link href="/"> <Logo/></Link>
      </div>
      <div > 
        <Links/> 
      </div>
    </div>
    </>
  )
}
