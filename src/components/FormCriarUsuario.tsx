import axios from "axios";
import { useState } from "react";

interface IDadosDoUsuario {
  nome: string;
  email: string;
  senha: string;
  genero: string;
  biografia: string;
}

interface FormCriarUsuarioProps {
  setMostrarCriarUsuario: React.Dispatch<React.SetStateAction<boolean>>;
  setUsuarioAtualizado: React.Dispatch<React.SetStateAction<number>>;
}

export function FormCriarUsuario({ setMostrarCriarUsuario, setUsuarioAtualizado }: FormCriarUsuarioProps) {

  const [dadosDoUsuario, setDadosDoUsuario] = useState<IDadosDoUsuario>({
    nome: "",
    email: "",
    senha: "",
    genero: "Masculino",
    biografia: "",
  })

  function criarUsuario(ev: React.FormEvent) {
    ev.preventDefault();
    
    axios.post("http://localhost:3000/usuarios", dadosDoUsuario).then(response => {
      setMostrarCriarUsuario(false);
      setUsuarioAtualizado(prev => prev + 1);
      alert(response.data.message);
    })

    setDadosDoUsuario({
      nome: "",
      email: "",
      senha: "",
      genero: "Masculino",
      biografia: "",
    })
  }

  return (
    <form onSubmit={criarUsuario} className="flex flex-col gap-4 w-full max-w-3xl">
      <input
        type="text"
        placeholder="Nome"
        value={dadosDoUsuario.nome}
        onChange={ev => setDadosDoUsuario({ ...dadosDoUsuario, nome: ev.target.value })}
        className="p-2 outline-none"
      />
      <input
        type="email"
        placeholder="E-mail"
        value={dadosDoUsuario.email}
        onChange={ev => setDadosDoUsuario({ ...dadosDoUsuario, email: ev.target.value })}
        className="p-2 outline-none"
      />
      <input
        type="password"
        placeholder="Senha"
        value={dadosDoUsuario.senha}
        onChange={ev => setDadosDoUsuario({ ...dadosDoUsuario, senha: ev.target.value })}
        className="p-2 outline-none"
      />
      <textarea
        placeholder="Biografia"
        value={dadosDoUsuario.biografia}
        onChange={ev => setDadosDoUsuario({ ...dadosDoUsuario, biografia: ev.target.value })}
        className="p-2 outline-none border-none"
        rows={4}
      />
      <div className="flex flex-col gap-2">
        <label className="font-bold">Gênero</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <input 
              type="radio"
              id="Masculino"
              value="Masculino"
              checked={dadosDoUsuario.genero === "Masculino"}
              onChange={ev => setDadosDoUsuario({ ...dadosDoUsuario, genero: ev.target.value })}
            />
            <label htmlFor="Masculino">Masculino</label>
          </div>
          <div className="flex items-center gap-1">
            <input 
              type="radio"
              id="Feminino"
              value="Feminino"
              checked={dadosDoUsuario.genero === "Feminino"}
              onChange={ev => setDadosDoUsuario({ ...dadosDoUsuario, genero: ev.target.value })}
            />
            <label htmlFor="Feminino">Feminino</label>
          </div>
        </div>
      </div>
      <button type="submit" className="bg-yellow-400 text-white font-bold text-center mx-auto text-lg py-2 rounded-lg w-36">Confirmar</button>
    </form>
  )
}