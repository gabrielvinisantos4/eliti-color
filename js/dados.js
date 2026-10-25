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
      id: "mercure",
      marca: "Mercure",
      titulo: "Mercure",
      linha: "Tinta Acrílica Mercure",
      /* Fonte: catálogo Mercure (foto enviada pela loja). Sem código nessas cores.
         Tons (hex) aproximados a partir da foto. Cinza Real e Marrom Barroco usam como
         referência de tom as cores Suvinil "Taça Real" e "Beijo Baiano". Papel Picado e
         Marrom Barroco não aparecem no catálogo, então ficam sem "linhas". */
      itens: [
        { id: "branco", nome: "Branco", hex: "#F2F2F0", linhas: ["Premium", "Standard", "Econômica"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "gelo", nome: "Gelo", hex: "#E1DDD6", linhas: ["Premium", "Standard", "Econômica"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "algodao-egipcio", nome: "Algodão Egípcio", hex: "#D6D0C4", linhas: ["Premium", "Standard", "Econômica"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "cromio", nome: "Crômio", hex: "#D7D6D4", linhas: ["Premium", "Standard", "Econômica"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "papel-picado", nome: "Papel Picado", hex: "#D7D3CA", imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "cinza-real", nome: "Cinza Real", hex: "#6E7678", linhas: ["Premium"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "espinafre", nome: "Espinafre", hex: "#56634F", linhas: ["Premium"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "oceano", nome: "Oceano", hex: "#264A8B", linhas: ["Premium"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "elefante", nome: "Elefante", hex: "#868686", linhas: ["Premium", "Standard", "Econômica"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "cenoura", nome: "Cenoura", hex: "#CF784D", linhas: ["Premium", "Standard"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "terracota", nome: "Terracota", hex: "#7D4434", linhas: ["Premium"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "marrom-barroco", nome: "Marrom Barroco", hex: "#6B574E", imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" },
        { id: "vermelho-intenso", nome: "Vermelho Intenso", hex: "#8D3430", linhas: ["Premium"], imagem: "assets/produtos/mercure-acrilica-premium.webp", imagemAlt: "Lata de Tinta Acrílica Premium Mercure" }
      ]
    },
    {
      id: "coral",
      marca: "Coral",
      titulo: "Coral",
      linha: "Coleção de cores Coral",
      /* CONFIRMAR com a loja: códigos e tons (hex) foram tirados da arte de divulgação
         "Coleção de cores Coral" enviada pela loja. Imagem da lata: Coral Mactra Vedbem Imperall
         (foto enviada pela loja). */
      /* Tons (hex) aproximados a partir da foto do catálogo enviado pela loja.
         Códigos só onde já havia o código Coral confirmado na arte; os demais ficam sem código. */
      itens: [
        { id: "branco",          nome: "Branco",          hex: "#F3F3F0", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "gelo",            nome: "Gelo",            hex: "#C9CAC1", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "silverado",       nome: "Silverado",       hex: "#7F807A", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "elefante",        nome: "Elefante",        codigo: "2371-4", hex: "#777872", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "areia",           nome: "Areia",           codigo: "1376-4", hex: "#D1C4AE", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "palha",           nome: "Palha",           hex: "#E0DFC6", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "camurca",         nome: "Camurça",         hex: "#928770", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "algodao-egipcio", nome: "Algodão Egípcio", codigo: "1036-2", hex: "#DAD7C6", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "papel-picado",    nome: "Papel Picado",    hex: "#D7D3CA", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" },
        { id: "ovelha",          nome: "Ovelha",          codigo: "1002-4", hex: "#BFBAB4", imagem: "assets/produtos/coral-mactra-vedbem-imperall.webp", imagemAlt: "Lata Coral Mactra Vedbem Imperall" }
      ]
    }
    /* Para um novo catálogo, copie um bloco acima, troque id/marca/titulo e cadastre os itens. */
  ],

  /* ---------------- OBRAS REALIZADAS ----------------
     Use somente fotos/vídeos reais de obras da Eliti Color.
     Campos (todos opcionais):
       titulo, local, tipo   : textos do card (ex.: tipo "Em andamento")
       imagem                : foto ("assets/obras/obra.webp"); em vídeo, é a capa
       video                 : vídeo mp4 sem áudio ("assets/obras/obra.mp4")
       antes, depois         : par de fotos para card de antes e depois
     A ordem da lista é a ordem na página.                                    */
  obras: [
    { tipo: "Antes e depois", local: "Jardim Olinda", antes: "assets/obras/jardim-olinda-antes.webp", depois: "assets/obras/jardim-olinda-depois.webp" },
    { tipo: "Em andamento", video: "assets/obras/obra-andamento-sobrado.mp4", imagem: "assets/obras/obra-andamento-sobrado.webp" },
    { tipo: "Antes e depois", antes: "assets/obras/fachada-antes.webp", depois: "assets/obras/fachada-depois.webp" },
    { tipo: "Obra concluída", imagem: "assets/obras/obra-casa-telhado-1.webp" },
    { tipo: "Fachada", local: "Paranapoema", video: "assets/obras/obra-paranapoema.mp4", imagem: "assets/obras/obra-paranapoema.webp" },
    { tipo: "Obra concluída", imagem: "assets/obras/obra-157.webp" },
    { tipo: "Em andamento", imagem: "assets/obras/obra-andamento-fachada-pedra.webp" },
    { tipo: "Em andamento", imagem: "assets/obras/obra-1529.webp" },
    { tipo: "Obra concluída", imagem: "assets/obras/obra-casa-telhado-2.webp" }
  ],

  /* ---------------- MENSAGEM DO WHATSAPP ---------------- */
  mensagem: {
    inicio: "Olá! Gostaria de solicitar um orçamento para as seguintes opções:",
    fim: "Por favor, podem me informar a disponibilidade e as opções de produto/embalagem?"
  }
};
