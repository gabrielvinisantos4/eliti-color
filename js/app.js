/* =====================================================================
   ELITI COLOR — catálogos, seleção, orçamento no WhatsApp, obras e
   vídeo da lata controlado pelo scroll.
   Os dados ficam em js/dados.js. Este arquivo só monta a página.
   ===================================================================== */
(function () {
  "use strict";
  var D = window.ELITI || {};
  var CATS = D.catalogos || [], OBRAS = D.obras || [], ATEND = D.atendentes || [], MSG = D.mensagem || {};
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* ---------- índice de itens selecionáveis ---------- */
  var ITENS = {};
  CATS.forEach(function (cat) {
    (cat.itens || []).forEach(function (it) {
      var key = cat.id + ":" + it.id;
      ITENS[key] = { key: key, cat: cat.id, marca: cat.marca, nome: it.nome, codigo: it.codigo || "", hex: it.hex || "", linhas: it.linhas || [], imagem: it.imagem || "", imagemAlt: it.imagemAlt || "" };
    });
  });

  /* ---------- estado (salvo só neste navegador) ---------- */
  var saved = store("eliti-selecao-v2") || {};
  var state = {
    itens: (saved.itens || []).filter(function (k) { return ITENS[k]; }),
    atendente: ATEND.some(function (a) { return a.id === saved.atendente; }) ? saved.atendente : (ATEND[0] && ATEND[0].id),
    aba: CATS.some(function (c) { return c.id === saved.aba; }) ? saved.aba : (CATS[0] && CATS[0].id)
  };
  function persist() { store("eliti-selecao-v2", state); }
  function isSel(k) { return state.itens.indexOf(k) !== -1; }
  function codTxt(it) { return it.codigo ? it.marca + " " + it.codigo : ""; }

  /* ---------- render: abas + catálogos ---------- */
  var tabs = $("#catTabs"), panels = $("#catPaineis");
  CATS.forEach(function (cat, ci) {
    var tab = el("button", { type: "button", role: "tab", id: "tab-" + cat.id, "aria-controls": "painel-" + cat.id, "data-aba": cat.id, class: "tab" },
      '<span class="tab-nome">' + esc(cat.titulo || cat.marca) + '</span><span class="tab-qtd">' + (cat.itens || []).length + ' cores</span><span class="tab-sel pill js-tabcount" data-cat="' + cat.id + '" hidden>0</span>');
    tabs.appendChild(tab);
    var panel = el("div", { role: "tabpanel", id: "painel-" + cat.id, "aria-labelledby": "tab-" + cat.id, class: "cat-painel", tabindex: "0" });
    if (cat.linha) panel.appendChild(el("p", { class: "cat-linha" }, '<span class="marca-tag marca-' + esc(cat.id) + '">' + esc(cat.marca) + '</span>' + esc(cat.linha)));
    var ul = el("ul", { class: "grid-cores" });
    (cat.itens || []).forEach(function (it, i) { ul.appendChild(card(ITENS[cat.id + ":" + it.id], i)); });
    panel.appendChild(ul);
    panels.appendChild(panel);
  });
  // cor clara pede texto escuro no botão aceso
  function clara(hex) {
    var h = String(hex || "").replace("#", ""); if (h.length !== 6) return false;
    var r = parseInt(h.substr(0, 2), 16) / 255, g = parseInt(h.substr(2, 2), 16) / 255, b = parseInt(h.substr(4, 2), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55;
  }
  function card(it, i) {
    var li = el("li", { class: "cor rv" + (it.imagem ? " tem-lata" : "") + (clara(it.hex) ? " cor-clara" : ""), "data-key": it.key, style: "--c:" + (it.hex || "#777") + ";--d:" + (i % 3) * 60 + "ms" });
    var lata = it.imagem ? '<img class="cor-lata" src="' + esc(it.imagem) + '" alt="' + esc(it.imagemAlt || ("Lata " + it.marca)) + '" loading="lazy" decoding="async" width="180" height="222">' : "";
    var linhas = it.linhas.length ? '<p class="cor-linhas">' + it.linhas.map(esc).join(" · ") + '</p>' : "";
    li.innerHTML =
      '<div class="cor-swatch"><span class="marca-tag marca-' + esc(it.cat) + '">' + esc(it.marca) + '</span>' + lata + '<span class="cor-check">' + ICON_CHECK + '</span></div>' +
      '<div class="cor-body">' +
        '<h3 class="cor-nome">' + esc(it.nome) + '</h3>' +
        (it.codigo ? '<p class="cor-cod">' + esc(codTxt(it)) + '</p>' : '<p class="cor-cod">' + esc(it.marca) + '</p>') +
        linhas +
        '<button type="button" class="add" data-key="' + it.key + '" aria-pressed="false">' +
          '<span class="t-add">' + ICON_PLUS + 'Adicionar à seleção</span>' +
          '<span class="t-sel">' + ICON_CHECK + 'Selecionado<span class="rm">Remover</span></span>' +
        '</button>' +
      '</div>';
    return li;
  }
  function setAba(id, focus) {
    state.aba = id; persist();
    $$(".tab").forEach(function (t) { var on = t.getAttribute("data-aba") === id; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    $$(".cat-painel").forEach(function (p) { p.hidden = p.id !== "painel-" + id; });
    $$(".cat-painel:not([hidden]) .rv").forEach(function (r) { r.classList.add("in"); });
  }
  tabs.addEventListener("click", function (e) { var t = e.target.closest(".tab"); if (t) setAba(t.getAttribute("data-aba")); });
  tabs.addEventListener("keydown", function (e) {
    var list = $$(".tab"), i = list.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); var n = (i + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length; setAba(list[n].getAttribute("data-aba"), true); }
  });

  /* ---------- render: obras ---------- */
  var gridObras = $("#gridObras");
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  if (OBRAS.length) {
    OBRAS.forEach(function (o, i) {
      var meta = [o.local, o.tipo].filter(Boolean).map(esc).join(" · ");
      var li = el("li", { class: "obra rv", style: "--d:" + (i % 3) * 80 + "ms" });
      var media = o.imagem ? '<img src="' + esc(o.imagem) + '" alt="' + esc(o.titulo || ("Obra da Eliti Color" + (o.local ? " — " + o.local : "") + (o.tipo ? " (" + o.tipo.toLowerCase() + ")" : ""))) + '" loading="lazy" decoding="async">' : '<span class="obra-noimg"></span>';
      var alt = "Obra da Eliti Color" + (o.local ? " — " + o.local : "") + (o.tipo ? " (" + o.tipo.toLowerCase() + ")" : "");
      if (o.antes && o.depois) {
        li.className += " obra-ad";
        li.innerHTML = '<div class="obra-media ad">' +
          '<figure><img src="' + esc(o.antes) + '" alt="' + esc(alt + ": antes") + '" loading="lazy" decoding="async"><figcaption>Antes</figcaption></figure>' +
          '<figure><img src="' + esc(o.depois) + '" alt="' + esc(alt + ": depois") + '" loading="lazy" decoding="async"><figcaption class="dep">Depois</figcaption></figure></div>';
      } else li.innerHTML = o.video
        ? '<button type="button" class="obra-media" data-video="' + esc(o.video) + '" data-poster="' + esc(o.imagem || "") + '" aria-label="Assistir vídeo' + (o.titulo ? ": " + esc(o.titulo) : "") + '">' + media + '<span class="obra-play">' + PLAY + '</span></button>'
        : '<div class="obra-media">' + media + '</div>';
      if (o.titulo || meta) li.innerHTML += '<div class="obra-info">' + (o.titulo ? '<h3>' + esc(o.titulo) + '</h3>' : '') + (meta ? '<p>' + meta + '</p>' : '') + '</div>';
      gridObras.appendChild(li);
    });
    // no computador (3 colunas) a última linha não fica com buraco: o último card ocupa o espaço que sobra
    var nota = $("#obrasNota"); nota.textContent = "Obras concluídas, em andamento e o antes e depois de fachadas."; nota.hidden = false;
    var cel = OBRAS.reduce(function (n, o) { return n + (o.antes && o.depois ? 2 : 1); }, 0);
    if (cel % 3 === 2 && !(OBRAS[OBRAS.length - 1].antes)) gridObras.lastElementChild.classList.add("largo");
  } else {
    // Espaços reservados: NÃO são obras reais. Somem quando houver itens em ELITI.obras.
    for (var k = 0; k < 6; k++) {
      var ph = el("li", { class: "obra ph rv", style: "--d:" + (k % 3) * 80 + "ms" });
      if (k > 0) ph.setAttribute("aria-hidden", "true");
      ph.innerHTML = '<div class="obra-media"><span class="ph-ic"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5.5-5.5L6 19"/></svg></span><span class="ph-tag">Espaço reservado</span><span class="ph-txt">Foto de obra em breve</span></div>';
      gridObras.appendChild(ph);
    }
    $("#obrasNota").hidden = false;
  }

  /* ---------- modal de vídeo das obras ---------- */
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
    var lab = el("label", { class: "at", for: "at-" + a.id });
    lab.innerHTML = '<input type="radio" name="atendente" id="at-' + a.id + '" value="' + a.id + '"><span class="at-box"><span class="at-nome">' + esc(a.nome) + '</span><span class="at-tel">' + esc(a.telefone || "") + '</span></span>';
    atWrap.appendChild(lab);
  });
  atWrap.addEventListener("change", function (e) { if (e.target.name === "atendente") { state.atendente = e.target.value; persist(); update(); } });

  /* ---------- mensagem e link do WhatsApp ---------- */
  function mensagem() {
    var linhas = state.itens.map(function (k, i) {
      var it = ITENS[k];
      return (i + 1) + ". " + it.marca + " — " + it.nome + (it.codigo ? " — Código " + it.codigo : "");
    });
    return MSG.inicio + "\n\n" + linhas.join("\n") + "\n\n" + MSG.fim;
  }
  function linkWhats() {
    var a = ATEND.filter(function (x) { return x.id === state.atendente; })[0] || ATEND[0];
    return "https://wa.me/" + a.whatsapp + "?text=" + encodeURIComponent(mensagem());
  }

  /* ---------- seleção: atualizar interface ---------- */
  var live = $("#live"), ctas = $$(".js-orcamento");
  var simSync = null;
  function update() {
    var n = state.itens.length;
    if (simSync) simSync();
    $$(".cor").forEach(function (c) {
      var key = c.getAttribute("data-key"), on = isSel(key), it = ITENS[key];
      c.classList.toggle("is-sel", on);
      var b = $(".add", c);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", (on ? "Remover " : "Adicionar ") + it.marca + " " + it.nome + (on ? " da seleção" : " à seleção"));
    });
    var list = $("#selLista"); list.innerHTML = "";
    state.itens.forEach(function (k) {
      var it = ITENS[k];
      var li = el("li", { class: "si" });
      li.innerHTML = '<span class="si-dot" style="--c:' + (it.hex || "#888") + '"></span>' +
        '<span class="si-txt"><small class="si-marca">' + esc(it.marca) + '</small><strong>' + esc(it.nome) + '</strong>' + (it.codigo ? '<small>Código ' + esc(it.codigo) + '</small>' : '') + '</span>' +
        '<button type="button" class="si-rm" data-rm="' + k + '" aria-label="Remover ' + esc(it.marca + " " + it.nome) + '">' + ICON_X + '</button>';
      list.appendChild(li);
    });
    $("#selVazio").hidden = n > 0;
    $("#selLimpar").hidden = n === 0;
    var txt = n === 0 ? "Nenhuma cor ainda" : (n === 1 ? "1 cor selecionada" : n + " cores selecionadas");
    $$(".js-count").forEach(function (e) { e.textContent = n; });
    $$(".js-count-txt").forEach(function (e) { e.textContent = txt; });
    $$(".js-bar-sub").forEach(function (e) { e.textContent = n ? "Ver seleção" : "Selecione uma ou mais cores para pedir orçamento"; });
    $$(".js-tabcount").forEach(function (e) {
      var c = state.itens.filter(function (k) { return ITENS[k].cat === e.getAttribute("data-cat"); }).length;
      e.textContent = c; e.hidden = c === 0;
    });
    $("#selBarDots").innerHTML = state.itens.slice(0, 6).map(function (k) { return '<i style="--c:' + (ITENS[k].hex || "#888") + '"></i>'; }).join("");
    $$('input[name="atendente"]').forEach(function (r) { r.checked = r.value === state.atendente; });
    var at = ATEND.filter(function (x) { return x.id === state.atendente; })[0];
    $$(".js-atendente").forEach(function (e) { e.textContent = at ? at.nome : ""; });
    ctas.forEach(function (a) {
      if (n) { a.href = linkWhats(); a.removeAttribute("aria-disabled"); a.classList.remove("off"); }
      else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.classList.add("off"); }
    });
    $$(".js-hint").forEach(function (e) { e.hidden = n > 0; });
    document.documentElement.classList.toggle("has-sel", n > 0);
  }
  function toggle(k) {
    var i = state.itens.indexOf(k), it = ITENS[k], nome = it.marca + " " + it.nome;
    if (i === -1) { state.itens.push(k); announce(nome + " adicionada à seleção. " + state.itens.length + " no total."); pulse(); }
    else { state.itens.splice(i, 1); announce(nome + " removida da seleção."); }
    persist(); update();
  }
  function announce(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }
  function pulse() { if (reduce) return; var b = $("#selBar"); b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse"); }

  document.addEventListener("click", function (e) {
    var add = e.target.closest && e.target.closest(".add");
    if (add) {
      toggle(add.getAttribute("data-key"));
      if (!reduce) { add.classList.remove("gota"); void add.offsetWidth; add.classList.add("gota"); }
      return;
    }
    var rm = e.target.closest && e.target.closest("[data-rm]");
    if (rm) toggle(rm.getAttribute("data-rm"));
  });
  $("#selLimpar").addEventListener("click", function () { state.itens = []; persist(); update(); announce("Seleção limpa."); });
  ctas.forEach(function (a) { a.addEventListener("click", function (e) { if (!state.itens.length) { e.preventDefault(); var g = $("#cores"); if (g) g.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); } }); });

  /* ---------- painel no celular ---------- */
  var sel = $("#selecao"), barBtn = $("#selToggle");
  function setOpen(o) { sel.classList.toggle("open", o); barBtn.setAttribute("aria-expanded", o ? "true" : "false"); }
  barBtn.addEventListener("click", function () { setOpen(!sel.classList.contains("open")); });
  $("#selFechar").addEventListener("click", function () { setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sel.classList.contains("open")) setOpen(false); });
  var topSel = $(".topbar-sel");
  if (topSel) topSel.addEventListener("click", function (e) { if (window.innerWidth < 1024) { e.preventDefault(); setOpen(true); } });

  /* ---------- topo fixo e barra inferior depois do hero ---------- */
  var hero = $("#inicio");
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (ents) { document.documentElement.classList.toggle("past-hero", !ents[0].isIntersecting); }, { rootMargin: "-40% 0px 0px 0px" }).observe(hero);
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

  /* =====================================================================
     VÍDEO DA LATA CONTROLADO PELO SCROLL
     Quadros do vídeo em assets/lata/d (computador) e assets/lata/m (celular).
     Rolar para baixo avança o vídeo; subir recua. Com movimento reduzido,
     mostra só a imagem estática (assets/lata/poster.webp).
     ===================================================================== */
  (function lata() {
    var sec = $("#lata"), cv = $("#lataCanvas"), copy = $("#lataCopy");
    if (!sec || !cv || !cv.getContext) return;
    if (reduce) { sec.classList.add("static"); return; }
    var small = Math.min(innerWidth, innerHeight) < 700;
    var N = small ? 40 : 60, dir = "assets/lata/" + (small ? "m" : "d") + "/";
    var frames = new Array(N), started = false, ctx = cv.getContext("2d"), W = 0, H = 0, dpr = 1, ticking = false, cur = 0;
    function pad(n) { return ("00" + n).slice(-3); }
    function load() {
      if (started) return; started = true;
      for (var i = 0; i < N; i++) (function (i) {
        var im = new Image(); im.decoding = "async";
        im.onload = function () { frames[i] = im; if (i === 0) { sec.classList.add("ready"); req(); } };
        im.src = dir + pad(i) + ".webp";
      })(i);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { if (e[0].isIntersecting) load(); }, { rootMargin: "1200px 0px" }).observe(sec);
    } else load();
    function size() { dpr = Math.min(devicePixelRatio || 1, 1.5); W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); req(); }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(draw); } }
    function progress() { var r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight; return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0; }
    function draw() {
      ticking = false; if (!W) size();
      var p = progress();
      // suaviza a troca de quadros (acompanha o scroll sem saltos)
      var target = p * (N - 1);
      cur += (target - cur) * 0.35;
      if (Math.abs(target - cur) > 0.05) req();
      var fi = Math.round(cur), im = frames[fi];
      if (!im) for (var s = fi; s >= 0; s--) if (frames[s]) { im = frames[s]; break; }
      copy.style.setProperty("--p", Math.min(1, Math.max(0, (p - 0.45) / 0.4)).toFixed(3));
      if (!im) return;
      var iw = im.naturalWidth, ih = im.naturalHeight, sc = Math.max(W / iw, H / ih), dw = iw * sc, dh = ih * sc;
      var ax = W < 700 ? 0.60 : 0.5;                       // no celular, centraliza no jato de tinta
      var dx = Math.min(0, Math.max(W - dw, W / 2 - dw * ax)), dy = (H - dh) / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(im, dx, dy, dw, dh);
    }
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", size);
    size();
  })();

  setAba(state.aba);
  update();
  window.__eliti = { state: state, mensagem: mensagem, link: linkWhats, setAba: setAba };


  /* ---------- simulador: a cor na parede, antes e depois ---------- */
  (function () {
    var quadro = $("#simQuadro"), cv = $("#simCanvas"); if (!quadro || !cv) return;
    var img = $(".sim-antes", quadro), range = $("#simRange"), coresBox = $("#simCores"), addBtn = $("#simAdd"), acao = $("#simAcao");
    var ctx = cv.getContext("2d", { willReadFrequently: true });
    var W = cv.width, H = cv.height, base = null, mask = null, ref = [1, 1, 1];
    var prev = document.createElement("canvas"), novo = document.createElement("canvas");
    prev.width = novo.width = W; prev.height = novo.height = H;
    var atual = null, anim = 0;
    // sRGB <-> linear
    var toLin = new Float32Array(256); for (var i = 0; i < 256; i++) { var c = i / 255; toLin[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    function toSrgb(v) { v = v <= 0 ? 0 : v >= 1 ? 1 : v; return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); }
    var LUT = new Uint8ClampedArray(4097); for (var j = 0; j <= 4096; j++) LUT[j] = toSrgb(j / 2048); // até 2.0 linear
    function hexLin(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (o) { return toLin[parseInt(h.substr(o, 2), 16)]; }); }

    // ordem: Coral, depois Mercure
    var lista = [];
    CATS.forEach(function (cat) {
      var g = el("div", { class: "sim-grupo" }, '<span class="sim-grupo-nome">' + esc(cat.marca) + '</span>');
      var row = el("div", { class: "sim-chips" });
      (cat.itens || []).forEach(function (it) {
        var k = cat.id + ":" + it.id, d = ITENS[k]; if (!d || !d.hex) return;
        lista.push(k);
        var b = el("button", { type: "button", class: "sim-chip" + (clara(d.hex) ? " clara" : ""), "data-sim": k, "aria-pressed": "false", "aria-label": d.marca + " " + d.nome, title: d.nome, style: "--c:" + d.hex });
        row.appendChild(b);
      });
      g.appendChild(row); coresBox.appendChild(g);
    });

    function carregar(src) { return new Promise(function (ok, erro) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = erro; im.src = src; }); }
    var parede = null;
    function preparar() {
      return Promise.all([img.complete && img.naturalWidth ? img : carregar(img.currentSrc || img.src), carregar("assets/simulador/mascara.webp"), carregar("assets/simulador/parede.webp")]).then(function (r) {
        var t = document.createElement("canvas"); t.width = W; t.height = H; var tc = t.getContext("2d", { willReadFrequently: true });
        tc.drawImage(r[0], 0, 0, W, H); base = tc.getImageData(0, 0, W, H).data;
        tc.clearRect(0, 0, W, H); tc.drawImage(r[2], 0, 0, W, H); parede = tc.getImageData(0, 0, W, H).data;
        tc.clearRect(0, 0, W, H); tc.drawImage(r[1], 0, 0, W, H); var m = tc.getImageData(0, 0, W, H).data;
        mask = new Float32Array(W * H); var lums = [];
        for (var p = 0, q = 0; p < mask.length; p++, q += 4) {
          var a = m[q] / 255; mask[p] = a < 0.004 ? 0 : a;
          if (a > 0.98 && (p & 3) === 0) lums.push(toLin[parede[q]] * 0.2126 + toLin[parede[q + 1]] * 0.7152 + toLin[parede[q + 2]] * 0.0722);
        }
        // branco de referência = luz típica da parede, para a cor sair fiel onde a luz é "normal"
        lums.sort(function (a, b) { return a - b; });
        var med = lums[Math.floor(lums.length * 0.55)] || 0.7, soma = [0, 0, 0], n = 0;
        for (var p2 = 0, q2 = 0; p2 < mask.length; p2 += 5, q2 += 20) {
          if (mask[p2] > 0.98) { var L = toLin[parede[q2]] * 0.2126 + toLin[parede[q2 + 1]] * 0.7152 + toLin[parede[q2 + 2]] * 0.0722; if (Math.abs(L - med) < med * 0.08) { soma[0] += toLin[parede[q2]]; soma[1] += toLin[parede[q2 + 1]]; soma[2] += toLin[parede[q2 + 2]]; n++; } }
        }
        ref = n ? [soma[0] / n, soma[1] / n, soma[2] / n] : [med, med, med];
      });
    }
    // foto + alfa * (parede pintada - parede original): bordas finas (capim, tecido) ficam corretas
    function pintar(destino, hex) {
      var c = hexLin(hex), k0 = c[0] / ref[0], k1 = c[1] / ref[1], k2 = c[2] / ref[2];
      var dc = destino.getContext("2d"), out = dc.createImageData(W, H), o = out.data;
      for (var p = 0, q = 0; p < mask.length; p++, q += 4) {
        var a = mask[p], r = base[q], g = base[q + 1], b = base[q + 2];
        if (a > 0) {
          var pr = parede[q], pg = parede[q + 1], pb = parede[q + 2];
          r += a * (LUT[Math.min(4096, (toLin[pr] * k0 * 2048) | 0)] - pr);
          g += a * (LUT[Math.min(4096, (toLin[pg] * k1 * 2048) | 0)] - pg);
          b += a * (LUT[Math.min(4096, (toLin[pb] * k2 * 2048) | 0)] - pb);
        }
        o[q] = r; o[q + 1] = g; o[q + 2] = b; o[q + 3] = 255;
      }
      dc.putImageData(out, 0, 0);
    }
    function escolher(k, ox, oy) {
      if (!ITENS[k]) return; atual = k;
      var it = ITENS[k];
      $("#simAmostra").style.setProperty("--c", it.hex);
      $("#simMarca").textContent = it.marca;
      $("#simNome").textContent = it.nome;
      $("#simCod").textContent = it.codigo ? "Código " + it.codigo : (it.linhas.length ? "Linhas: " + it.linhas.join(", ") : "");
      acao.style.setProperty("--c", it.hex); acao.classList.toggle("cor-clara", clara(it.hex));
      addBtn.setAttribute("data-key", k);
      $$(".sim-chip", coresBox).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-sim") === k ? "true" : "false"); });
      simSync();
      if (!base) return;
      pintar(novo, it.hex);
      cancelAnimationFrame(anim);
      if (reduce) { ctx.drawImage(novo, 0, 0); prev.getContext("2d").drawImage(novo, 0, 0); return; }
      // a cor nova se espalha pela parede como tinta
      var cx = ox == null ? W * 0.5 : ox, cy = oy == null ? H * 0.4 : oy, maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)), t0 = performance.now(), D = 650;
      (function passo(t) {
        var e = Math.max(0, Math.min(1, (t - t0) / D)), k2 = 1 - Math.pow(1 - e, 3);
        ctx.drawImage(prev, 0, 0);
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, maxR * k2, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(novo, 0, 0); ctx.restore();
        if (e < 1) anim = requestAnimationFrame(passo); else prev.getContext("2d").drawImage(novo, 0, 0);
      })(t0);
    }
    simSync = function () {
      var k = addBtn.getAttribute("data-key"); if (!k || !ITENS[k]) return;
      var on = isSel(k), it = ITENS[k];
      acao.classList.toggle("is-sel", on);
      addBtn.setAttribute("aria-pressed", on ? "true" : "false");
      addBtn.setAttribute("aria-label", (on ? "Remover " : "Adicionar ") + it.marca + " " + it.nome + (on ? " da seleção" : " à seleção"));
      $(".t-add", addBtn).innerHTML = ICON_PLUS + "Adicionar " + esc(it.nome) + " à seleção";
      $(".t-sel", addBtn).innerHTML = ICON_CHECK + esc(it.nome) + " está na seleção<span class=\"rm\">Remover</span>";
    };
    coresBox.addEventListener("click", function (e) {
      var b = e.target.closest(".sim-chip"); if (!b) return;
      escolher(b.getAttribute("data-sim"));
    });

    // antes e depois: arrastar em qualquer ponto da imagem
    function pos(v) { v = Math.max(0, Math.min(100, v)); quadro.style.setProperty("--pos", v + "%"); range.value = v; }
    var arrastando = false;
    function deX(e) { var r = quadro.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    quadro.addEventListener("pointerdown", function (e) { if (e.button > 0) return; arrastando = true; quadro.setPointerCapture(e.pointerId); quadro.classList.add("arrastando"); pos(deX(e)); });
    quadro.addEventListener("pointermove", function (e) { if (arrastando) pos(deX(e)); });
    function soltar() { arrastando = false; quadro.classList.remove("arrastando"); }
    quadro.addEventListener("pointerup", soltar); quadro.addEventListener("pointercancel", soltar);
    range.addEventListener("input", function () { pos(+range.value); });
    pos(50);

    var inicial = state.itens.filter(function (k) { return lista.indexOf(k) !== -1; })[0] || (lista.indexOf("coral:oceano") !== -1 ? "coral:oceano" : lista[0]);
    var iniciado = false;
    function iniciar() {
      if (iniciado) return; iniciado = true;
      preparar().then(function () {
        ctx.drawImage(img, 0, 0, W, H); prev.getContext("2d").drawImage(img, 0, 0, W, H);
        quadro.classList.add("pronto");
        escolher(inicial);
      }).catch(function () { quadro.classList.add("sem-sim"); });
    }
    escolher(inicial);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); iniciar(); } }, { rootMargin: "600px 0px" });
      io.observe(quadro);
    } else iniciar();
  })();

  /* ---------- logo animada (toca uma vez e para na logo montada) ---------- */
  (function () {
    var box = $("#logoAnim"); if (!box || reduce) return;
    var img = $(".logo-anim-img", box);
    var ua = navigator.userAgent;
    // no iPhone/iPad todo navegador usa o motor do Safari (sem transparência em WebM)
    var ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var safari = /^((?!chrome|chromium|android|edg|firefox).)*safari/i.test(ua);
    function usarWebp() {
      var anim = new Image();
      anim.onload = function () { img.src = anim.src; };
      anim.src = "assets/logo-animada.webp";
    }
    if (ios || safari) { usarWebp(); return; }
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.setAttribute("muted", "");
    v.preload = "auto"; v.setAttribute("aria-hidden", "true");
    v.src = "assets/logo-animada.webm";
    var desistiu = false;
    function desistir() { if (desistiu) return; desistiu = true; box.classList.remove("tocando"); if (v.parentNode) v.parentNode.removeChild(v); usarWebp(); }
    // só mostra o vídeo depois de confirmar que o canto dele é transparente
    v.addEventListener("playing", function () {
      if (desistiu) return;
      try {
        var c = document.createElement("canvas"); c.width = 8; c.height = 8;
        var cx = c.getContext("2d"); cx.drawImage(v, 0, 0, 40, 40, 0, 0, 8, 8);
        var d = cx.getImageData(0, 0, 8, 8).data, opaco = 0;
        for (var i = 3; i < d.length; i += 4) if (d[i] > 200) opaco++;
        if (opaco > 8) { desistir(); return; }
      } catch (e) { desistir(); return; }
      box.classList.add("tocando");
    });
    v.addEventListener("error", desistir);
    box.appendChild(v);
    var p = v.play(); if (p && p.catch) p.catch(function () { desistir(); });
    // passar o mouse na logo toca de novo
    var ultima = 0;
    box.addEventListener("mouseenter", function () {
      if (!box.classList.contains("tocando") || !v.ended || Date.now() - ultima < 1500) return;
      ultima = Date.now(); v.currentTime = 0; v.play();
    });
  })();
})();
