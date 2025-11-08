import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center p-[1em]'>
      <Link href='/' className='cursor-pointer'>
        <Image
          src='/next-view-logo.svg'
          alt='Next View Logo'
          width={90}
          height={50}
        />
      </Link>
    </nav>
  );
}
