import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import adminLogo from '@/public/assets/images/admin_profile.png'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag } from 'react-icons/md'
import LogoutButton from './LogoutButton'

const UserDropdown = () => {
  const auth = useSelector((store) => store.authStore.auth)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={adminLogo.src} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="me-5 w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className='font-semibold'>{auth?.name}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="" className='cursor-pointer'>
              <IoShirtOutline />
              New Product
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="" className='cursor-pointer'>
              <MdOutlineShoppingBag />
              Orders
            </Link>
          </DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown