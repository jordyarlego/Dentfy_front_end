import Link from 'next/link';
import Logotipo from '../../../public/assets/Logo.png';
import { BellIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Image from 'next/image'; 

export default function HeaderPerito() {
  return (
    <header className="bg-[#12212B] border-b border-cyan-900/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <Image
                src={Logotipo}
                alt="Dentfy Logo"
                width={32} 
                height={32} 
                className="h-8 w-auto"
                priority 
              />
              <span className="ml-3 text-xl font-bold text-white hidden md:block">
                Dentfy <span className="text-amber-400">Perito</span>
              </span>
            </Link>
          </div>

          
          <nav className="hidden md:flex space-x-8">
            <Link href="/laudos" className="text-amber-100 hover:text-white px-3 py-2 text-sm font-medium flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-1" />
              Laudos
            </Link>
            <Link href="/casos" className="text-amber-100 hover:text-white px-3 py-2 text-sm font-medium">
              Meus Casos
            </Link>
            <Link href="/agenda" className="text-amber-100 hover:text-white px-3 py-2 text-sm font-medium">
              Agenda
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-amber-100 hover:text-white focus:outline-none relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 bg-amber-500 rounded-full h-2 w-2"></span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">Dr. Carlos Silva</p>
                <p className="text-xs text-amber-300">Perito Odontolegal</p>
              </div>
              <div className="relative">
                
                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full h-2 w-2 border border-[#12212B]"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}