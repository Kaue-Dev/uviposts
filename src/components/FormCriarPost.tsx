import axios from "axios";
import { useEffect, useState } from "react";
import { Usuario } from "../interfaces/Interfaces";
import { Get } from "../services/Get";

interface IDadosPost {
  titulo_do_post: string;
  texto_do_post: string;
  postado_por: number;
}

interface FormCriarPostProps {
  setMostrarCriarPost: React.Dispatch<React.SetStateAction<boolean>>;
  setPostAtualizado: React.Dispatch<React.SetStateAction<number>>;
  setUsuarioAtualizado: React.Dispatch<React.SetStateAction<number>>;
}

export function FormCriarPost({ setMostrarCriarPost, setPostAtualizado, setUsuarioAtualizado }: FormCriarPostProps) {

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [dadosDoPost, setDadosDoPost] = useState<IDadosPost>({
    titulo_do_post: "",
    texto_do_post: "",
    postado_por: 1,
  });

  useEffect(() => {
    Get("http://localhost:3000/usuarios").then(response => { setUsuarios(response.data) });
  }, []);

  function criarPost(ev: React.FormEvent) {
    ev.preventDefault();

    axios.post("http://localhost:3000/posts", dadosDoPost).then(response => {
      setMostrarCriarPost(false);
      setPostAtualizado(prev => prev + 1);
      setUsuarioAtualizado(prev => prev + 1);
      alert(response.data.message);
    });

    setDadosDoPost({
      titulo_do_post: "",
      texto_do_post: "",
      postado_por: 1,
    });
  }

  return (
    <form onSubmit={criarPost} className="flex flex-col gap-4 w-full max-w-3xl">
      <input
        type="text"
        placeholder="Título do Post"
        value={dadosDoPost.titulo_do_post}
        onChange={ev => setDadosDoPost({ ...dadosDoPost, titulo_do_post: ev.target.value })}
        className="p-2 outline-none"
      />
      <textarea
        placeholder="Texto do Post"
        value={dadosDoPost.texto_do_post}
        onChange={ev => setDadosDoPost({ ...dadosDoPost, texto_do_post: ev.target.value })}
        rows={4}
        className="p-2 outline-none"
      />
      <div>
        <label className="font-bold">Postado Por:</label>
        <select value={dadosDoPost.postado_por} onChange={ev => setDadosDoPost({ ...dadosDoPost, postado_por: Number(ev.target.value) })} className="w-full p-2 border mt-1">
          <option value="">Selecione um usuário</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-yellow-400 text-white font-bold text-center mx-auto text-lg py-2 rounded-lg w-36">Confirmar</button>
    </form>
  );
}
