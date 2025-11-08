"use client";
import { User } from "@firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../utils/firebase/firebase";
import SignIn from "./Sign-In";
import Upload from "./Upload";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((currentUser) => {
      setUser(currentUser);
    });
    // cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <nav className='flex justify-between items-center p-[1em]'>
      <Link href='/' className='cursor-pointer'>
        <Image
          src='/next-view-logo.svg'
          alt='Next View Logo'
          width={70}
          height={50}
        />
      </Link>
      {user && <Upload />}
      <SignIn user={user} />
    </nav>
  );
}
