import axios from "axios";
import { useState } from "react";

interface FormAlterarPostProps {
  setMostrarAlterarPost: React.Dispatch<React.SetStateAction<boolean>>;
  setPostAtualizado: React.Dispatch<React.SetStateAction<number>>;
  post_id: number;
}

export function FormAlterarPost({ setMostrarAlterarPost, setPostAtualizado, post_id }: FormAlterarPostProps) {

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTexto, setNovoTexto] = useState("");

  function alterarPost(ev: React.FormEvent) {
    ev.preventDefault();

    axios.put(`http://localhost:3000/posts/${post_id}`, {
      titulo_do_post: novoTitulo,
      texto_do_post: novoTexto
    }).then(response => {
      console.log(response.data.message);
      setMostrarAlterarPost(false);
      setPostAtualizado(prev => prev + 1);
    })
  }

  return (
    <form className="flex flex-col gap-4 w-full max-w-3xl" onSubmit={alterarPost}>
      <input
        type="text"
        placeholder="Novo título do Post"
        value={novoTitulo}
        onChange={ev => setNovoTitulo(ev.target.value)}
        className="p-2 outline-none"
      />
      <textarea
        placeholder="Novo texto do Post"
        rows={4}
        value={novoTexto}
        onChange={ev => setNovoTexto(ev.target.value)}
        className="p-2 outline-none"
      />
      <button type="submit" className="bg-yellow-400 text-white font-bold text-center mx-auto text-lg py-2 rounded-lg w-36">Confirmar</button>
    </form>
  )
}