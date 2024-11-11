import { useEffect, useState } from "react";
import { Usuario } from "../interfaces/Interfaces";
import { Get } from "../services/Get";
import axios from "axios";

interface FormComentarProps {
  post_id: number;
  setPostAtualizado: React.Dispatch<React.SetStateAction<number>>;
  setMostrarComentar: React.Dispatch<React.SetStateAction<number>>;
}

export function FormComentar({ post_id, setPostAtualizado, setMostrarComentar }: FormComentarProps) {

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [comentario, setComentario] = useState<string>("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number>(0);

  useEffect(() => {
    Get("http://localhost:3000/usuarios").then(response => { setUsuarios(response.data) });
  }, []);

  function criarComentario(ev: React.FormEvent) {
    ev.preventDefault();

    if (comentario.trim() === "" || usuarioSelecionado === 0) {
      alert("Preencha todos os campos");
    }

    axios.post("http://localhost:3000/comentarios", {
      texto_do_comentario: comentario,
      comentado_por: usuarioSelecionado,
      post_id,
    }).then(response => {
      console.log(response.data.message);
      setComentario("");
      setUsuarioSelecionado(0);
      setPostAtualizado(prev => prev + 1);
      setMostrarComentar(0);
    })
  }

  return (
    <form className="flex flex-col bg-white p-1" onSubmit={criarComentario}>
      <textarea
        placeholder="Escreva seu comentário"
        className="p-2 outline-none mb-4 border"
        rows={3}
        value={comentario}
        onChange={ev => setComentario(ev.target.value)}
      />
      <div>
        <select className="p-2 border outline-none mb-4 w-full" onChange={ev => setUsuarioSelecionado(Number(ev.target.value))}>
          <option>Selecione um usuário</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Comentar
      </button>
    </form>
  )
}