/* =====================================================================
   ELITI COLOR — DADOS DO SITE
   ---------------------------------------------------------------------
   ÚNICO arquivo para cadastrar catálogos, cores, produtos, latas,
   obras e atendentes. A página monta tudo automaticamente a partir daqui.

   Regras:
   - Cadastre somente informações reais, confirmadas com a loja/fabricante.
   - "id" único, sem espaços e sem acento (ex.: "algodao-egipcio").
   - Campo que não existe = deixe vazio ou não coloque. Nada é inventado
     na tela nem na mensagem do WhatsApp.
   ===================================================================== */

window.ELITI = {

  /* ---------------- ATENDENTES (WhatsApp) ----------------
     whatsapp: só dígitos, com 55 + DDD.                                */
  atendentes: [
    { id: "tiago", nome: "Tiago", whatsapp: "5544991113969", telefone: "(44) 99111-3969" },
    { id: "eliel", nome: "Eliel", whatsapp: "5544998130641", telefone: "(44) 99813-0641" }
  ],

  /* ---------------- CATÁLOGOS (um por marca/linha) ----------------
     Cada catálogo vira uma aba no site.
       marca   : nome da marca (aparece no card, na lista e na mensagem)
       titulo  : título da aba
       linha   : texto curto sobre a linha (opcional)
       itens   : cores/produtos do catálogo
     Campos de cada item:
       id      : único dentro do catálogo (obrigatório)
       nome    : nome real da cor/produto (obrigatório)
       codigo  : código real (opcional — se não existir, não aparece)
       hex     : cor da amostra na tela (referência visual aproximada)
       linhas  : linhas em que a cor existe (opcional, ex.: ["Premium"])
       imagem  : foto real da lata/produto (opcional, PNG/WebP com fundo transparente)
       imagemAlt: descrição da foto (opcional)                                       */
  catalogos: [
    {
      id: "coral",
      marca: "Coral",
      titulo: "Coral",
      linha: "Coleção de cores Coral",
      /* CONFIRMAR com a loja: códigos e tons (hex) foram tirados da arte de divulgação.
         O projeto ainda não tem foto real de lata Coral — por isso "imagem" está vazio. */
      itens: [
        { id: "algodao-egipcio", nome: "Algodão Egípcio", codigo: "1036-2", hex: "#EBE3D6" },
        { id: "ovelha",          nome: "Ovelha",          codigo: "1002-4", hex: "#DED2C1" },
        { id: "areia",           nome: "Areia",           codigo: "1376-4", hex: "#BBA384" },
        { id: "cromio",          nome: "Crômio",          codigo: "2685-4", hex: "#928473" },
        { id: "cenoura",         nome: "Cenoura",         codigo: "2286-4", hex: "#B04A21" },
        { id: "espinafre",       nome: "Espinafre",       codigo: "1958-6", hex: "#2A432C" },
        { id: "oceano",          nome: "Oceano",          codigo: "2871-6", hex: "#0B3452" },
        { id: "cinza-real",      nome: "Cinza Real",      codigo: "7151-4", hex: "#92908E" },
        { id: "elefante",        nome: "Elefante",        codigo: "2371-4", hex: "#3E3E3E" }
      ]
    },
    {
      id: "mercure",
      marca: "Mercure",
      titulo: "Mercure",
      linha: "Tinta Acrílica Mercure",
      /* Fonte: Catálogo Mercure Tintas 2025, página 8 (Acrílicas Premium, Standard e Econômica).
         O catálogo não traz código para essas cores, então "codigo" fica vazio.
         O tom (hex) é o da amostra digital do catálogo.
         Imagem: lata real de Tinta Acrílica Premium, do mesmo catálogo (página 4). */
      itens: [
        { id: "areia",            nome: "Areia",            hex: "#FCF0DD", linhas: ["Premium", "Standard", "Econômica"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "camurca",          nome: "Camurça",          hex: "#E3CEB8", linhas: ["Premium", "Standard", "Econômica"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "capuccino",        nome: "Capuccino",        hex: "#C7A468", linhas: ["Premium"],                          imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "terracota",        nome: "Terracota",        hex: "#B06439", linhas: ["Premium"],                          imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "vermelho-intenso", nome: "Vermelho Intenso", hex: "#C7625B", linhas: ["Premium"],                          imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "acafrao",          nome: "Açafrão",          hex: "#EDC863", linhas: ["Premium", "Standard"],              imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "kiwi",             nome: "Kiwi",             hex: "#B7CF8B", linhas: ["Premium", "Standard"],              imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "jade",             nome: "Jade",             hex: "#5A9989", linhas: ["Premium"],                          imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "azul-royal",       nome: "Azul Royal",       hex: "#5C9BD6", linhas: ["Premium"],                          imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "oceano",           nome: "Oceano",           hex: "#465D82", linhas: ["Premium"],                          imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" }
      ]
    }
    /* Para um novo catálogo, copie um bloco acima, troque id/marca/titulo e cadastre os itens. */
  ],

  /* ---------------- OBRAS REALIZADAS (opcional) ----------------
     Enquanto a lista estiver vazia, a galeria mostra espaços reservados
     neutros. Use somente fotos/vídeos reais de obras da Eliti Color.
     Campos (todos opcionais, mas informe "imagem" e/ou "video"):
       titulo, local, tipo, imagem ("assets/obras/obra-01.webp"), video ("assets/obras/obra-01.mp4")
     Exemplo de formato:
     { titulo: "", local: "", tipo: "", imagem: "assets/obras/obra-01.webp", video: "" }  */
  obras: [],

  /* ---------------- MENSAGEM DO WHATSAPP ---------------- */
  mensagem: {
    inicio: "Olá! Gostaria de solicitar um orçamento para as seguintes opções:",
    fim: "Por favor, podem me informar a disponibilidade e as opções de produto/embalagem?"
  }
};
