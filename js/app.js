/* =====================================================================
   ELITI COLOR — showroom de cores, leque (seleção), orçamento no
   WhatsApp, obras e vídeo da lata controlado pelo scroll.
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
  function luz(hex) { var h = (hex || "#888").replace("#", ""); var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }

  var SETA = '<svg class="seta" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK = '<svg class="check" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var MAIS = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var XIS = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* ---------- índice de itens ---------- */
  var ITENS = {};
  CATS.forEach(function (cat) {
    (cat.itens || []).forEach(function (it) {
      var key = cat.id + ":" + it.id;
      ITENS[key] = { key: key, cat: cat.id, marca: cat.marca, nome: it.nome, codigo: it.codigo || "", hex: it.hex || "#888", linhas: it.linhas || [], imagem: it.imagem || "", imagemAlt: it.imagemAlt || "" };
    });
  });

  /* ---------- estado (salvo só neste navegador) ---------- */
  var saved = store("eliti-selecao-v2") || {};
  var state = {
    itens: (saved.itens || []).filter(function (k) { return ITENS[k]; }),
    atendente: ATEND.some(function (a) { return a.id === saved.atendente; }) ? saved.atendente : (ATEND[0] && ATEND[0].id)
  };
  var vista = {}; // cor em destaque em cada showroom
  var pronto = false;
  function persist() { store("eliti-selecao-v2", { itens: state.itens, atendente: state.atendente }); }
  function isSel(k) { return state.itens.indexOf(k) !== -1; }

  /* =====================================================================
     SHOWROOMS: um por catálogo. Lista de nomes + lâmina gigante na cor
     escolhida + lata real + ficha com o botão de seleção.
     ===================================================================== */
  var host = $("#showrooms");
  CATS.forEach(function (cat, ci) {
    var itens = (cat.itens || []).map(function (it) { return ITENS[cat.id + ":" + it.id]; });
    if (!itens.length) return;
    vista[cat.id] = itens[0].key;
    var sec = el("section", { class: "sala sala-" + esc(cat.id) + (ci % 2 ? " sala-inv" : ""), id: cat.id, "aria-labelledby": "t-" + cat.id });
    var nomes = itens.map(function (it) {
      return '<li><button type="button" class="nome" data-ver="' + it.key + '" aria-pressed="false">' +
        '<span class="lamina-mini" style="--c:' + it.hex + '" aria-hidden="true"></span>' +
        '<span class="nome-txt">' + esc(it.nome) + '</span>' +
        '<span class="nome-tem" aria-hidden="true">' + CHECK + '</span>' +
        '<span class="sr-only nome-sr"></span></button></li>';
    }).join("");
    sec.innerHTML =
      '<div class="sala-cab rv">' +
        '<h2 class="titulo" id="t-' + esc(cat.id) + '">' + esc(cat.titulo || cat.marca) + '</h2>' +
        '<p class="sala-linha">' + esc(cat.linha || "") + ' · ' + itens.length + ' cores</p>' +
      '</div>' +
      '<div class="sala-grade">' +
        '<ul class="nomes rv" aria-label="Cores ' + esc(cat.marca) + '">' + nomes + '</ul>' +
        '<div class="palco rv" aria-hidden="true">' +
          '<div class="palco-lamina"><span class="furo"></span></div>' +
          '<img class="palco-lata a" alt="" decoding="async"><img class="palco-lata b" alt="" decoding="async">' +
        '</div>' +
        '<div class="ficha rv" aria-live="polite">' +
          '<p class="ficha-nome"></p>' +
          '<p class="ficha-cod"></p>' +
          '<p class="ficha-linhas"></p>' +
          '<button type="button" class="add" data-key="" aria-pressed="false">' +
            '<span class="add-fundo" aria-hidden="true"></span>' +
            '<span class="add-a">' + MAIS + 'Adicionar à seleção</span>' +
            '<span class="add-b">' + CHECK + 'No seu leque<small>Remover</small></span>' +
          '</button>' +
        '</div>' +
      '</div>';
    host.appendChild(sec);
    ver(cat.id, itens[0].key, true);
  });

  function ver(catId, key, primeira) {
    vista[catId] = key;
    var it = ITENS[key], sec = $("#" + catId);
    if (!sec) return;
    sec.style.setProperty("--c", it.hex);
    sec.classList.toggle("clara", luz(it.hex) > 0.62);
    $$(".nome", sec).forEach(function (b) { var on = b.getAttribute("data-ver") === key; b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("ativo", on); });
    $(".ficha-nome", sec).textContent = it.nome;
    $(".ficha-cod", sec).textContent = it.marca + (it.codigo ? " · Código " + it.codigo : "");
    $(".ficha-linhas", sec).textContent = it.linhas.length ? "Linhas: " + it.linhas.join(", ") : "";
    $(".ficha-linhas", sec).hidden = !it.linhas.length;
    $(".add", sec).setAttribute("data-key", key);
    // troca da lata: duas camadas que se alternam (crossfade curto)
    var a = $(".palco-lata.a", sec), b = $(".palco-lata.b", sec);
    var atual = a.classList.contains("on") ? a : b, prox = atual === a ? b : a;
    if (it.imagem) {
      prox.alt = it.imagemAlt || ("Lata " + it.marca);
      if (prox.getAttribute("src") !== it.imagem) prox.src = it.imagem;
      prox.classList.add("on"); if (atual !== prox) atual.classList.remove("on");
      if (primeira) atual.classList.remove("on");
    } else { a.classList.remove("on"); b.classList.remove("on"); }
    if (pronto) update();
  }
  document.addEventListener("click", function (e) {
    var n = e.target.closest && e.target.closest("[data-ver]");
    if (n) { var key = n.getAttribute("data-ver"); ver(ITENS[key].cat, key); }
  });
  // setas do teclado navegam pela lista de cores
  document.addEventListener("keydown", function (e) {
    var n = document.activeElement;
    if (!n || !n.classList || !n.classList.contains("nome")) return;
    if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].indexOf(e.key) < 0) return;
    var list = $$(".nome", n.closest(".nomes")), i = list.indexOf(n);
    var d = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
    var nx = list[(i + d + list.length) % list.length];
    e.preventDefault(); nx.focus(); nx.click();
  });

  /* ---------- obras: grade assimétrica ---------- */
  var gridObras = $("#gridObras");
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  if (OBRAS.length) {
    OBRAS.forEach(function (o, i) {
      var meta = [o.local, o.tipo].filter(Boolean).map(esc).join(" · ");
      var li = el("li", { class: "obra rv f" + (i % 6) });
      var media = o.imagem ? '<img src="' + esc(o.imagem) + '" alt="' + esc(o.titulo || "Obra realizada pela Eliti Color") + '" loading="lazy" decoding="async">' : '<span class="obra-sem"></span>';
      var legenda = (o.titulo || meta) ? '<span class="obra-legenda">' + (o.titulo ? '<strong>' + esc(o.titulo) + '</strong>' : '') + (meta ? '<span>' + meta + '</span>' : '') + '</span>' : '';
      li.innerHTML = o.video
        ? '<button type="button" class="obra-media" data-video="' + esc(o.video) + '" data-poster="' + esc(o.imagem || "") + '" aria-label="Assistir vídeo' + (o.titulo ? ": " + esc(o.titulo) : "") + '">' + media + '<span class="obra-play">' + PLAY + '</span>' + legenda + '</button>'
        : '<div class="obra-media">' + media + legenda + '</div>';
      gridObras.appendChild(li);
    });
  } else {
    // Espaços reservados: NÃO são obras reais. Somem quando houver itens em ELITI.obras.
    for (var k = 0; k < 6; k++) {
      var ph = el("li", { class: "obra reserva rv f" + k });
      if (k > 0) ph.setAttribute("aria-hidden", "true");
      ph.innerHTML = '<div class="obra-media"><span class="furo"></span><span class="reserva-txt">Espaço para foto de obra</span></div>';
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
    var lab = el("label", { class: "at", for: "at-" + a.id });
    lab.innerHTML = '<input type="radio" name="atendente" id="at-' + a.id + '" value="' + a.id + '"><span class="at-caixa"><span class="at-nome">' + esc(a.nome) + '</span><span class="at-tel">' + esc(a.telefone || "") + '</span></span>';
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

  /* ---------- atualizar interface ---------- */
  var live = $("#live"), ctas = $$(".js-orcamento");
  function update() {
    var n = state.itens.length;
    // showrooms
    $$(".sala").forEach(function (sec) {
      var b = $(".add", sec), key = b.getAttribute("data-key"); if (!key) return;
      var on = isSel(key), it = ITENS[key];
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", (on ? "Remover " : "Adicionar ") + it.marca + " " + it.nome + (on ? " do seu leque" : " à seleção"));
      sec.classList.toggle("no-leque", on);
    });
    $$(".nome").forEach(function (b) {
      var on = isSel(b.getAttribute("data-ver"));
      b.classList.toggle("tem", on);
      $(".nome-sr", b).textContent = on ? " (no seu leque)" : "";
    });
    // lista do leque
    var list = $("#selLista"); list.innerHTML = "";
    state.itens.forEach(function (k) {
      var it = ITENS[k];
      var li = el("li", { class: "li-cor" });
      li.innerHTML = '<span class="lamina-mini" style="--c:' + it.hex + '"></span>' +
        '<span class="li-txt"><small>' + esc(it.marca) + '</small><strong>' + esc(it.nome) + '</strong>' + (it.codigo ? '<small>Código ' + esc(it.codigo) + '</small>' : '') + '</span>' +
        '<button type="button" class="li-rm" data-rm="' + k + '" aria-label="Remover ' + esc(it.marca + " " + it.nome) + '">' + XIS + '</button>';
      list.appendChild(li);
    });
    $("#selVazio").hidden = n > 0;
    $("#selLimpar").hidden = n === 0;
    var txt = n === 0 ? "Seu leque está vazio" : (n === 1 ? "1 cor no seu leque" : n + " cores no seu leque");
    $$(".js-count").forEach(function (e) { e.textContent = n; });
    $$(".js-count-txt").forEach(function (e) { e.textContent = txt; });
    $$(".js-bar-sub").forEach(function (e) { e.textContent = n ? "Ver e enviar" : "Toque numa cor para começar"; });
    // mini leque: lâminas abertas em leque
    var vis = state.itens.slice(-7), m = vis.length;
    $("#selBarDots").innerHTML = vis.map(function (k, i) {
      var ang = m > 1 ? (i - (m - 1) / 2) * Math.min(11, 44 / (m - 1)) : 0;
      return '<i style="--c:' + ITENS[k].hex + ';--r:' + ang.toFixed(1) + 'deg"></i>';
    }).join("") || '<i class="vazio" style="--r:0deg"></i>';
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
    if (i === -1) { state.itens.push(k); announce(nome + " adicionada ao seu leque. " + state.itens.length + " no total."); feedback(k); }
    else { state.itens.splice(i, 1); announce(nome + " removida do seu leque."); }
    persist(); update();
  }
  function announce(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }
  function feedback(k) {
    if (reduce) return;
    var sec = $("#" + ITENS[k].cat), b = $("#selBar"), dock = $("#selecao");
    [sec, dock].forEach(function (x) { if (!x) return; x.classList.remove("carimbo"); void x.offsetWidth; x.classList.add("carimbo"); });
    b.classList.remove("pulso"); void b.offsetWidth; b.classList.add("pulso");
  }
  document.addEventListener("click", function (e) {
    var add = e.target.closest && e.target.closest(".add");
    if (add) { var k = add.getAttribute("data-key"); if (k) toggle(k); return; }
    var rm = e.target.closest && e.target.closest("[data-rm]");
    if (rm) toggle(rm.getAttribute("data-rm"));
  });
  $("#selLimpar").addEventListener("click", function () { state.itens = []; persist(); update(); announce("Seu leque foi limpo."); });
  ctas.forEach(function (a) { a.addEventListener("click", function (e) { if (!state.itens.length) { e.preventDefault(); var g = $("#coral"); if (g) g.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); } }); });

  /* ---------- leque: abrir/fechar ---------- */
  var dock = $("#selecao"), barBtn = $("#selToggle");
  function setOpen(o) { dock.classList.toggle("open", o); barBtn.setAttribute("aria-expanded", o ? "true" : "false"); }
  barBtn.addEventListener("click", function () { setOpen(!dock.classList.contains("open")); });
  $("#selFechar").addEventListener("click", function () { setOpen(false); barBtn.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && dock.classList.contains("open")) { setOpen(false); barBtn.focus(); } });

  /* ---------- barra superior e leque aparecem depois da abertura ---------- */
  var hero = $("#inicio");
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (ents) { document.documentElement.classList.toggle("past-hero", !ents[0].isIntersecting); }, { rootMargin: "-55% 0px 0px 0px" }).observe(hero);
  } else document.documentElement.classList.add("past-hero");

  /* ---------- revelar ao rolar (uma vez) ---------- */
  var rvs = $$(".rv");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    rvs.forEach(function (r) { io.observe(r); });
  } else rvs.forEach(function (r) { r.classList.add("in"); });

  /* ---------- profundidade no scroll: a lâmina e a lata ganham presença ---------- */
  if (!reduce) {
    var salas = $$(".sala, .obras"), tick = false;
    var prof = function () {
      tick = false;
      var vh = innerHeight;
      salas.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));   // 0 entrando -> 1 em foco
        s.style.setProperty("--p", p.toFixed(3));
      });
    };
    addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(prof); } }, { passive: true });
    addEventListener("resize", prof); prof();
  }

  /* ---------- vídeo da abertura ---------- */
  var v = $(".hero-lamina video");
  if (v) { if (reduce) { v.removeAttribute("autoplay"); v.pause(); } else { v.muted = true; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } }

  /* =====================================================================
     VÍDEO DA LATA CONTROLADO PELO SCROLL
     Quadros em assets/lata/d (computador) e assets/lata/m (celular).
     Rolar para baixo avança; subir recua. Movimento reduzido: imagem fixa.
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
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { if (e[0].isIntersecting) load(); }, { rootMargin: "1200px 0px" }).observe(sec);
    else load();
    function size() { dpr = Math.min(devicePixelRatio || 1, 1.5); W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); req(); }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(draw); } }
    function progress() { var r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight; return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0; }
    function draw() {
      ticking = false; if (!W) size();
      var p = progress(), target = p * (N - 1);
      cur += (target - cur) * 0.35;
      if (Math.abs(target - cur) > 0.05) req();
      copy.style.setProperty("--p", Math.min(1, Math.max(0, (p - 0.4) / 0.4)).toFixed(3));
      var fi = Math.round(cur), im = frames[fi];
      if (!im) for (var s = fi; s >= 0; s--) if (frames[s]) { im = frames[s]; break; }
      if (!im) return;
      var iw = im.naturalWidth, ih = im.naturalHeight, sc = Math.max(W / iw, H / ih), dw = iw * sc, dh = ih * sc;
      var ax = W < 700 ? 0.60 : 0.42;
      var dx = Math.min(0, Math.max(W - dw, W / 2 - dw * ax)), dy = (H - dh) / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(im, dx, dy, dw, dh);
    }
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", size);
    size();
  })();

  pronto = true;
  update();
  window.__eliti = { state: state, mensagem: mensagem, link: linkWhats, ver: ver };
})();
