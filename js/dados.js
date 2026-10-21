/* =====================================================================
   ELITI COLOR — DADOS DO SITE
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para cadastrar
   cores, produtos, obras realizadas e atendentes. A página monta tudo
   automaticamente a partir daqui.

   Regras:
   - Cadastre somente informações reais, confirmadas com a loja.
   - "id" deve ser único, sem espaços e sem acento (ex.: "algodao-egipcio").
   - Campos opcionais podem ser omitidos ou deixados vazios.
   ===================================================================== */

window.ELITI = {

  /* ---------------- ATENDENTES (WhatsApp) ----------------
     whatsapp: só dígitos, com 55 + DDD.                                */
  atendentes: [
    { id: "tiago", nome: "Tiago", whatsapp: "5544991113969", telefone: "(44) 99111-3969" },
    { id: "eliel", nome: "Eliel", whatsapp: "5544998130641", telefone: "(44) 99813-0641" }
  ],

  /* ---------------- CATÁLOGO DE CORES ----------------
     nome   : nome da cor (obrigatório)
     codigo : código como deve aparecer no site e na mensagem (obrigatório)
     hex    : cor da amostra na tela. É uma referência visual aproximada.
              CONFIRMAR: os tons abaixo foram medidos da arte de divulgação
              e os códigos ainda serão confirmados com a loja.            */
  cores: [
    { id: "algodao-egipcio", nome: "Algodão Egípcio", codigo: "Coral 1036-2", hex: "#EBE3D6" },
    { id: "ovelha",          nome: "Ovelha",          codigo: "Coral 1002-4", hex: "#DED2C1" },
    { id: "areia",           nome: "Areia",           codigo: "Coral 1376-4", hex: "#BBA384" },
    { id: "cromio",          nome: "Crômio",          codigo: "Coral 2685-4", hex: "#928473" },
    { id: "cenoura",         nome: "Cenoura",         codigo: "Coral 2286-4", hex: "#B04A21" },
    { id: "espinafre",       nome: "Espinafre",       codigo: "Coral 1958-6", hex: "#2A432C" },
    { id: "oceano",          nome: "Oceano",          codigo: "Coral 2871-6", hex: "#0B3452" },
    { id: "cinza-real",      nome: "Cinza Real",      codigo: "Coral 7151-4", hex: "#92908E" },
    { id: "elefante",        nome: "Elefante",        codigo: "Coral 2371-4", hex: "#3E3E3E" }
  ],

  /* ---------------- PRODUTOS (opcional) ----------------
     A seção "Produtos" só aparece quando houver pelo menos um item aqui.
     Cadastre apenas produtos reais vendidos pela loja.
     Exemplo de formato (não é um produto real):
     { id: "id-unico", nome: "Nome do produto", codigo: "Código/referência",
       marca: "Marca", descricao: "Texto curto", imagem: "assets/produtos/arquivo.webp" }   */
  produtos: [],

  /* ---------------- OBRAS REALIZADAS (opcional) ----------------
     Enquanto a lista estiver vazia, a galeria mostra espaços reservados
     neutros. Use somente fotos/vídeos reais de obras da Eliti Color.
     Todos os campos são opcionais, exceto "imagem" OU "video".
       titulo : ex.: "Fachada comercial"
       local  : ex.: "Centro"
       tipo   : ex.: "Pintura externa"
       imagem : foto (ou capa do vídeo), ex.: "assets/obras/obra-01.webp"
       video  : vídeo .mp4 da obra (abre em janela, sem som automático)
     Exemplo de formato:
     { titulo: "", local: "", tipo: "", imagem: "assets/obras/obra-01.webp", video: "" }  */
  obras: [],

  /* ---------------- MENSAGEM DO WHATSAPP ---------------- */
  mensagem: {
    inicioCores: "Olá! Gostaria de solicitar um orçamento para as seguintes cores:",
    inicioItens: "Olá! Gostaria de solicitar um orçamento para os seguintes itens:",
    fim: "Por favor, podem me informar a disponibilidade e as opções de produto/embalagem?"
  }
};
