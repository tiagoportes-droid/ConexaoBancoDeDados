const formProduto = document.querySelector("#formProduto");
const txtProduto = document.querySelector("#txtProduto");
const mensagem = document.querySelector("#mensagem");
const listaProdutos = document.querySelector("#listaProdutos");

formProduto.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nomeProduto = txtProduto.value;

  mensagem.textContent = "Enviando Para o Servidor...";
  mensagem.className = "Carregando";

  try {
    const resposta = await fetch("http://localhost:3000/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ produto: nomeProduto }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      mensagem.textContent = dados.mensagem; 
      mensagem.className = "sucesso";

      const li = document.createElement("li");
      li.textContent = `ID ${dados.id_inserido}: ${nomeProduto}`;
      listaProdutos.appendChild(li);

      txtProduto.value = "";
    } else {
      mensagem.textContent = `erro: ${dados.erro}`;
      mensagem.className = "erro";
    }
  } catch (err) {
    console.error("Erro na requisição", err); 
    mensagem.textContent = "Falha ao conectar com o servidor.";
    mensagem.className = "erro";
  }
});