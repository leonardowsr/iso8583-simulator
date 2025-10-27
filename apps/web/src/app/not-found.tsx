import Header from "@/components/nav/header";
import Link from "next/link";


export default function NotFound() {
   return (<>
        <Header/>
      <div className="flex flex-col items-center justify-center">
         <h1 className="text-9xl font-bold mt-10">404</h1>
         <div className=" bottom-4 text-center">
            <p className="text-lg">Página não encontrada</p>
            <Link href="/" className="text-blue-500 hover:underline">
               Voltar para a página inicial
            </Link>
         </div>
      </div></>
   )
}
