import InputTeste from '../../components/ComponentInput'
import HeroLogin from '../../components/HeroLogin'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#12212B]">
      {/* Lado Esquerdo - Formulário (35% em desktop, 100% em mobile) */}
      <div className="w-full lg:w-[35%] flex items-center justify-center p-4 lg:p-8">
        <div className="bg-[#12212B] p-6 lg:p-8 rounded-2xl shadow-md w-full max-w-md">
          <div className="flex flex-col items-center mb-6 lg:mb-8">
            <h1 className='text-white font-bold text-4xl lg:text-5xl mb-2 tracking-tighter transform hover:scale-105 transition duration-300'>
              Dentfy
            </h1>
            
            <p className="text-cyan-100 text-center mb-4 text-sm lg:text-base max-w-md">
              Bem-vindo à plataforma de registros periciais odonto-legais! Gerencie e consulte casos de forma segura e prática.
            </p>
            
            <div className="h-1 w-16 lg:w-20 bg-cyan-400 rounded-full mb-4 lg:mb-6"></div>
            <h1 className="text-xl lg:text-2xl font-bold text-center text-white">
              Login
            </h1>
          </div>
          
          <form className="space-y-4 lg:space-y-6">
            <InputTeste label="Email" type="email" placeholder="Digite seu email" />
            <InputTeste label="Senha" type="password" placeholder="Digite sua senha" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-100">
                  Lembrar de mim
                </label>
              </div>
              
              <div className="text-sm">
                <Link href="/esqueci-senha" className="font-medium text-cyan-400 hover:text-cyan-300 underline">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-[200px] h-[50px] bg-[#01777B] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center mx-auto"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

      
      <HeroLogin />
    </div>
  )
}