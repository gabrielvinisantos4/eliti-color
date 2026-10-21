/* =====================================================================
   ELITI COLOR — catálogo interativo, seleção e pedido de orçamento
   Os dados ficam em js/dados.js. Este arquivo só monta a página.
   ===================================================================== */
(function () {
  "use strict";
  var D = window.ELITI || {};
  var CORES = D.cores || [], PRODUTOS = D.produtos || [], OBRAS = D.obras || [];
  var ATEND = D.atendentes || [];
  var MSG = D.mensagem || {};
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else if (k === "style") e.setAttribute("style", attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* ---------- catálogo: índice de itens selecionáveis ---------- */
  var ITENS = {};
  CORES.forEach(function (c) { ITENS["cor:" + c.id] = { key: "cor:" + c.id, tipo: "cor", nome: c.nome, codigo: c.codigo, hex: c.hex }; });
  PRODUTOS.forEach(function (p) { ITENS["produto:" + p.id] = { key: "produto:" + p.id, tipo: "produto", nome: p.nome, codigo: p.codigo, imagem: p.imagem }; });

  /* ---------- estado ---------- */
  var saved = store("eliti-selecao") || {};
  var state = {
    itens: (saved.itens || []).filter(function (k) { return ITENS[k]; }),
    atendente: ATEND.some(function (a) { return a.id === saved.atendente; }) ? saved.atendente : (ATEND[0] && ATEND[0].id)
  };
  function persist() { store("eliti-selecao", state); }
  function isSel(k) { return state.itens.indexOf(k) !== -1; }

  /* ---------- render: cores ---------- */
  function cardCor(c, i) {
    var key = "cor:" + c.id;
    var li = el("li", { class: "cor rv", "data-key": key, style: "--c:" + c.hex + ";--d:" + (i % 3) * 70 + "ms" });
    li.innerHTML =
      '<div class="cor-swatch" aria-hidden="true"><span class="cor-check">' + ICON_CHECK + '</span></div>' +
      '<div class="cor-body">' +
        '<h3 class="cor-nome">' + esc(c.nome) + '</h3>' +
        '<p class="cor-cod">' + esc(c.codigo) + '</p>' +
        '<button type="button" class="add" data-key="' + key + '" aria-pressed="false">' +
          '<span class="t-add">' + ICON_PLUS + 'Adicionar à seleção</span>' +
          '<span class="t-sel">' + ICON_CHECK + 'Selecionado<span class="rm">Remover</span></span>' +
        '</button>' +
      '</div>';
    return li;
  }
  function cardProduto(p, i) {
    var key = "produto:" + p.id;
    var li = el("li", { class: "cor prod rv", "data-key": key, style: "--d:" + (i % 3) * 70 + "ms" });
    li.innerHTML =
      '<div class="cor-swatch prod-img" aria-hidden="true">' + (p.imagem ? '<img src="' + esc(p.imagem) + '" alt="" loading="lazy" decoding="async">' : '') + '<span class="cor-check">' + ICON_CHECK + '</span></div>' +
      '<div class="cor-body">' +
        (p.marca ? '<p class="cor-cod">' + esc(p.marca) + '</p>' : '') +
        '<h3 class="cor-nome">' + esc(p.nome) + '</h3>' +
        (p.codigo ? '<p class="cor-cod">' + esc(p.codigo) + '</p>' : '') +
        (p.descricao ? '<p class="prod-desc">' + esc(p.descricao) + '</p>' : '') +
        '<button type="button" class="add" data-key="' + key + '" aria-pressed="false">' +
          '<span class="t-add">' + ICON_PLUS + 'Adicionar à seleção</span>' +
          '<span class="t-sel">' + ICON_CHECK + 'Selecionado<span class="rm">Remover</span></span>' +
        '</button>' +
      '</div>';
    return li;
  }
  var gridCores = $("#gridCores");
  CORES.forEach(function (c, i) { gridCores.appendChild(cardCor(c, i)); });
  if (PRODUTOS.length) {
    $("#blocoProdutos").hidden = false;
    var gp = $("#gridProdutos");
    PRODUTOS.forEach(function (p, i) { gp.appendChild(cardProduto(p, i)); });
  }

  /* ---------- render: obras ---------- */
  var gridObras = $("#gridObras");
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  if (OBRAS.length) {
    OBRAS.forEach(function (o, i) {
      var meta = [o.local, o.tipo].filter(Boolean).map(esc).join(' · ');
      var li = el("li", { class: "obra rv", style: "--d:" + (i % 3) * 80 + "ms" });
      var media = o.imagem ? '<img src="' + esc(o.imagem) + '" alt="' + esc(o.titulo || "Obra realizada pela Eliti Color") + '" loading="lazy" decoding="async">' : '<span class="obra-noimg"></span>';
      if (o.video) {
        li.innerHTML = '<button type="button" class="obra-media" data-video="' + esc(o.video) + '" data-poster="' + esc(o.imagem || "") + '" aria-label="Assistir vídeo' + (o.titulo ? ": " + esc(o.titulo) : "") + '">' + media + '<span class="obra-play">' + PLAY + '</span></button>';
      } else {
        li.innerHTML = '<div class="obra-media">' + media + '</div>';
      }
      if (o.titulo || meta) li.innerHTML += '<div class="obra-info">' + (o.titulo ? '<h3>' + esc(o.titulo) + '</h3>' : '') + (meta ? '<p>' + meta + '</p>' : '') + '</div>';
      gridObras.appendChild(li);
    });
  } else {
    // Espaços reservados: NÃO são obras reais. Somem assim que houver itens em ELITI.obras.
    for (var k = 0; k < 6; k++) {
      var ph = el("li", { class: "obra ph rv", style: "--d:" + (k % 3) * 80 + "ms", "aria-hidden": k > 0 ? "true" : "false" });
      ph.innerHTML = '<div class="obra-media"><span class="ph-ic"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5.5-5.5L6 19"/></svg></span><span class="ph-tag">Espaço reservado</span><span class="ph-txt">Foto de obra em breve</span></div>';
      gridObras.appendChild(ph);
    }
    $("#obrasNota").hidden = false;
  }

  /* ---------- modal de vídeo ---------- */
  var modal = $("#modal"), mvid = $("#modalVideo");
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-video]");
    if (!b || !modal) return;
    mvid.src = b.getAttribute("data-video");
    var p = b.getAttribute("data-poster"); if (p) mvid.poster = p; else mvid.removeAttribute("poster");
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
  });
  function closeModal() { mvid.pause(); mvid.removeAttribute("src"); mvid.load(); if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  if (modal) {
    $("#modalClose").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener("cancel", function () { mvid.pause(); });
  }

  /* ---------- atendentes ---------- */
  var atWrap = $("#selAtendentes");
  ATEND.forEach(function (a) {
    var id = "at-" + a.id;
    var lab = el("label", { class: "at", for: id });
    lab.innerHTML = '<input type="radio" name="atendente" id="' + id + '" value="' + a.id + '"><span class="at-box"><span class="at-nome">' + esc(a.nome) + '</span><span class="at-tel">' + esc(a.telefone || "") + '</span></span>';
    atWrap.appendChild(lab);
  });
  atWrap.addEventListener("change", function (e) { if (e.target.name === "atendente") { state.atendente = e.target.value; persist(); update(); } });

  /* ---------- mensagem e link do WhatsApp ---------- */
  function mensagem() {
    var itens = state.itens.map(function (k) { return ITENS[k]; });
    var soCores = itens.every(function (it) { return it.tipo === "cor"; });
    var linhas = itens.map(function (it, i) { return (i + 1) + ". " + it.nome + (it.codigo ? " — " + it.codigo : ""); });
    return (soCores ? MSG.inicioCores : MSG.inicioItens) + "\n\n" + linhas.join("\n") + "\n\n" + MSG.fim;
  }
  function linkWhats() {
    var a = ATEND.filter(function (x) { return x.id === state.atendente; })[0] || ATEND[0];
    return "https://wa.me/" + a.whatsapp + "?text=" + encodeURIComponent(mensagem());
  }

  /* ---------- seleção: atualizar interface ---------- */
  var live = $("#live");
  var ctas = $$(".js-orcamento");
  function update() {
    var n = state.itens.length;
    // cards
    $$(".cor").forEach(function (card) {
      var on = isSel(card.getAttribute("data-key"));
      card.classList.toggle("is-sel", on);
      var b = $(".add", card);
      var nm = ITENS[card.getAttribute("data-key")].nome;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", on ? "Remover " + nm + " da seleção" : "Adicionar " + nm + " à seleção");
    });
    // lista
    var list = $("#selLista"); list.innerHTML = "";
    state.itens.forEach(function (k) {
      var it = ITENS[k];
      var li = el("li", { class: "si" });
      li.innerHTML = (it.hex ? '<span class="si-dot" style="--c:' + it.hex + '"></span>' : '<span class="si-dot prod"></span>') +
        '<span class="si-txt"><strong>' + esc(it.nome) + '</strong><small>' + esc(it.codigo || "") + '</small></span>' +
        '<button type="button" class="si-rm" data-rm="' + k + '" aria-label="Remover ' + esc(it.nome) + '">' + ICON_X + '</button>';
      list.appendChild(li);
    });
    $("#selVazio").hidden = n > 0;
    $("#selLimpar").hidden = n === 0;
    var plural = n === 1 ? "1 cor selecionada" : n + " cores selecionadas";
    if (state.itens.some(function (k) { return ITENS[k].tipo !== "cor"; })) plural = n === 1 ? "1 item selecionado" : n + " itens selecionados";
    $$(".js-count").forEach(function (e) { e.textContent = n; });
    $$(".js-count-txt").forEach(function (e) { e.textContent = n ? plural : "Nenhuma cor ainda"; });
    $$(".js-bar-sub").forEach(function (e) { e.textContent = n ? "Ver seleção" : "Escolha uma cor no catálogo"; });
    $("#selBarDots").innerHTML = state.itens.slice(0, 6).map(function (k) { var it = ITENS[k]; return '<i style="--c:' + (it.hex || "#888") + '"></i>'; }).join("");
    // atendente
    $$('input[name="atendente"]').forEach(function (r) { r.checked = r.value === state.atendente; });
    var at = ATEND.filter(function (x) { return x.id === state.atendente; })[0];
    $$(".js-atendente").forEach(function (e) { e.textContent = at ? at.nome : ""; });
    // botão principal
    ctas.forEach(function (a) {
      if (n) { a.href = linkWhats(); a.removeAttribute("aria-disabled"); a.classList.remove("off"); a.tabIndex = 0; }
      else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.classList.add("off"); }
    });
    $$(".js-hint").forEach(function (e) { e.hidden = n > 0; });
    document.documentElement.classList.toggle("has-sel", n > 0);
  }
  function toggle(k) {
    var i = state.itens.indexOf(k), nome = ITENS[k].nome;
    if (i === -1) { state.itens.push(k); announce(nome + " adicionada à seleção. " + state.itens.length + " no total."); pulse(); }
    else { state.itens.splice(i, 1); announce(nome + " removida da seleção."); }
    persist(); update();
  }
  function announce(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }
  function pulse() { if (reduce) return; var b = $("#selBar"); b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse"); }

  document.addEventListener("click", function (e) {
    var add = e.target.closest && e.target.closest(".add");
    if (add) { toggle(add.getAttribute("data-key")); return; }
    var rm = e.target.closest && e.target.closest("[data-rm]");
    if (rm) { toggle(rm.getAttribute("data-rm")); return; }
  });
  $("#selLimpar").addEventListener("click", function () { state.itens = []; persist(); update(); announce("Seleção limpa."); });
  ctas.forEach(function (a) { a.addEventListener("click", function (e) { if (!state.itens.length) { e.preventDefault(); var g = $("#cores"); if (g) g.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); } }); });

  /* ---------- painel no celular (abre/fecha) ---------- */
  var sel = $("#selecao"), barBtn = $("#selToggle");
  function setOpen(o) { sel.classList.toggle("open", o); barBtn.setAttribute("aria-expanded", o ? "true" : "false"); document.documentElement.classList.toggle("sheet-open", o); }
  barBtn.addEventListener("click", function () { setOpen(!sel.classList.contains("open")); });
  $("#selFechar").addEventListener("click", function () { setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sel.classList.contains("open")) setOpen(false); });
  var topSel = $(".topbar-sel");
  if (topSel) topSel.addEventListener("click", function (e) {
    if (window.innerWidth < 1024) { e.preventDefault(); setOpen(true); }
  });

  /* ---------- topo fixo e barra inferior aparecem depois do hero ---------- */
  var hero = $("#inicio");
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (ents) {
      var past = !ents[0].isIntersecting;
      document.documentElement.classList.toggle("past-hero", past);
    }, { threshold: 0, rootMargin: "-40% 0px 0px 0px" }).observe(hero);
  } else document.documentElement.classList.add("past-hero");

  /* ---------- revelar ao rolar ---------- */
  var rvs = $$(".rv");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rvs.forEach(function (r) { io.observe(r); });
  } else rvs.forEach(function (r) { r.classList.add("in"); });

  /* ---------- vídeo do hero ---------- */
  var v = $(".media video");
  if (v) { if (reduce) { v.removeAttribute("autoplay"); v.pause(); } else { v.muted = true; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } }

  update();

  // exposto só para testes/manutenção
  window.__eliti = { state: state, mensagem: mensagem, link: linkWhats };
})();
