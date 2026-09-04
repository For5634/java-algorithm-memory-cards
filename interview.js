(function () {
  "use strict";

  const STORAGE_KEY = "java-interview-flashcards:simple:v1";
  const LEGACY_KEY = "java-interview-flashcards:v1";
  const PROFICIENCY = ["生疏", "一般", "熟练"];
  const DEFAULT_CATEGORIES = ["Agent", "MySQL", "计算机网络", "Spring Boot", "JVM", "Redis", "操作系统"];
  const NEW_CATEGORY = "__new_category__";
  const els = Object.fromEntries(["searchInput", "categoryFilters", "cardCount", "cardList", "flashcard", "flipButton", "cardCategory", "cardProficiency", "cardQuestion", "cardFlipTip", "cardCategoryBack", "cardProficiencyBack", "cardAnswerLabel", "cardAnswer", "weakButton", "normalButton", "masteredButton", "newCardButton", "cardForm", "categorySelect", "newCategoryField", "saveButton", "cancelEditButton", "editButton", "deleteButton", "aiSourceInput", "generateBulkButton", "aiStatus", "aiPreview", "aiPreviewCount", "aiPreviewList", "importAiCardsButton", "exportButton", "importInput", "toast"].map((id) => [id, document.getElementById(id)]));
  const state = { cards: loadCards(), query: "", category: "全部", activeId: null, revealStage: 0, editingId: null, dirty: false, aiCards: [], preferredCategory: DEFAULT_CATEGORIES[0] };

  function readJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
  function saveCards() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards)); }
  function createId() { return `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
  function escapeHtml(value) { return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
  function formatText(value) {
    return escapeHtml(value)
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replaceAll("\n", "<br>");
  }
  function conciseAnswer(answer) {
    const firstParagraph = String(answer || "").trim().split(/\n\s*\n/)[0].trim();
    if (firstParagraph.length <= 180) return firstParagraph;
    const sentence = firstParagraph.match(/^.{1,180}?[。！？；.!?]/)?.[0];
    return sentence || `${firstParagraph.slice(0, 180)}…`;
  }
  function showToast(message) { els.toast.textContent = message; els.toast.classList.add("visible"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove("visible"), 2400); }
  function proficiencyIndex(value) { return Math.max(0, PROFICIENCY.indexOf(value)); }

  function loadCards() {
    const saved = readJson(STORAGE_KEY, null);
    if (Array.isArray(saved)) return saved.map(normalizeCard);
    const legacy = readJson(LEGACY_KEY, []);
    const migrated = Array.isArray(legacy) ? legacy.map((card) => normalizeCard({ id: card.id, category: card.module || "未分类", proficiency: legacyProficiency(card), question: card.question || card.title || "", detailedAnswer: card.interviewAnswer || card.shortAnswer || "" })).filter((card) => card.question || card.detailedAnswer) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }
  function legacyProficiency(card) { const status = readJson("java-interview-progress:v1", {})[card.id]?.status; return status === "mastered" ? "熟练" : status === "good" ? "一般" : "生疏"; }
  function normalizeCard(card) {
    const legacyAnswer = String(card.answer || "").trim();
    const detailedAnswer = String(card.detailedAnswer || legacyAnswer).trim();
    return { id: card.id || createId(), category: String(card.category || "未分类").trim(), proficiency: PROFICIENCY.includes(card.proficiency) ? card.proficiency : "生疏", question: String(card.question || "").trim(), briefAnswer: String(card.briefAnswer || conciseAnswer(legacyAnswer || detailedAnswer)).trim(), detailedAnswer };
  }
  function categories() { return [...new Set([...DEFAULT_CATEGORIES, ...state.cards.map((card) => card.category).filter(Boolean)])]; }
  function filteredCards() {
    const query = state.query.trim().toLowerCase();
    return state.cards.filter((card) => (state.category === "全部" || card.category === state.category) && (!query || [card.category, card.question, card.briefAnswer, card.detailedAnswer, card.proficiency].join(" ").toLowerCase().includes(query))).sort((a, b) => proficiencyIndex(a.proficiency) - proficiencyIndex(b.proficiency));
  }
  function activeCard() { return state.cards.find((card) => card.id === state.activeId); }
  function chooseActive() { const cards = filteredCards(); if (!cards.some((card) => card.id === state.activeId)) state.activeId = cards[0]?.id || null; }

  function render() { chooseActive(); renderCategories(); renderCard(); renderList(); renderCategorySelect(); }
  function renderCategories() {
    const values = ["全部", ...categories().filter((category) => state.cards.some((card) => card.category === category))];
    els.categoryFilters.innerHTML = values.map((category) => `<button class="tag-button ${state.category === category ? "active" : ""}" data-category="${escapeHtml(category)}" type="button">${escapeHtml(category)}</button>`).join("");
    els.categoryFilters.querySelectorAll("button").forEach((button) => button.onclick = () => { if (!discardDraftForNavigation()) return; state.category = button.dataset.category; state.revealStage = 0; render(); });
  }
  function renderCard() {
    const card = activeCard(); const hasCard = Boolean(card);
    els.flashcard.classList.toggle("flipped", state.revealStage > 0); els.flashcard.dataset.proficiency = card?.proficiency || "生疏"; els.flashcard.dataset.revealStage = state.revealStage; els.flipButton.disabled = !hasCard;
    [els.weakButton, els.normalButton, els.masteredButton, els.editButton, els.deleteButton].forEach((button) => button.disabled = !hasCard);
    if (!card) { els.cardCategory.textContent = "未分类"; els.cardProficiency.textContent = "生疏"; els.cardCategoryBack.textContent = "未分类"; els.cardProficiencyBack.textContent = "生疏"; els.cardAnswerLabel.textContent = "精简答案"; els.cardFlipTip.textContent = "保存后，点击卡片即可翻面复习。"; els.cardQuestion.textContent = "还没有卡片。请在右侧填写分类、熟练度、题面和答案。"; els.cardAnswer.textContent = "保存后，点击卡片即可翻面复习。"; return; }
    els.cardCategory.textContent = card.category; els.cardCategoryBack.textContent = card.category; els.cardProficiency.textContent = card.proficiency; els.cardProficiencyBack.textContent = card.proficiency; els.cardQuestion.textContent = card.question;
    els.cardAnswerLabel.textContent = state.revealStage === 2 ? "详细答案" : "精简答案"; els.cardAnswer.innerHTML = formatText(state.revealStage === 2 ? card.detailedAnswer : card.briefAnswer);
    els.flipButton.textContent = state.revealStage === 0 ? "查看精简答案" : state.revealStage === 1 ? "查看详细答案" : "查看题面";
    els.cardFlipTip.textContent = state.revealStage === 2 ? "可在卡片内滚动阅读；点击右上角“查看题面”返回。" : "点击卡片继续查看答案。";
  }
  function renderList() {
    const cards = filteredCards(); els.cardCount.textContent = `${cards.length} 张卡片 · 生疏优先`;
    els.cardList.innerHTML = cards.map((card) => `<button class="simple-list-card ${card.id === state.activeId ? "active" : ""}" data-proficiency="${escapeHtml(card.proficiency)}" data-id="${escapeHtml(card.id)}" type="button"><span>${escapeHtml(card.category)}</span><strong>${escapeHtml(card.question)}</strong><small>${escapeHtml(card.proficiency)}</small></button>`).join("") || '<p class="note">没有符合条件的卡片。</p>';
    els.cardList.querySelectorAll("button").forEach((button) => button.onclick = () => { if (!discardDraftForNavigation()) return; state.activeId = button.dataset.id; state.revealStage = 0; render(); });
  }
  function renderCategorySelect() {
    const previous = els.categorySelect.value;
    els.categorySelect.innerHTML = `${categories().map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}<option value="${NEW_CATEGORY}">＋ 新建分类</option>`;
    if ([...els.categorySelect.options].some((option) => option.value === state.preferredCategory)) els.categorySelect.value = state.preferredCategory;
    else if ([...els.categorySelect.options].some((option) => option.value === previous)) els.categorySelect.value = previous;
    else els.categorySelect.value = categories()[0];
    toggleNewCategoryField();
  }
  function toggleNewCategoryField() { const isNew = els.categorySelect.value === NEW_CATEGORY; els.newCategoryField.classList.toggle("hidden", !isNew); els.cardForm.elements.newCategory.required = isNew; }
  function cardFromForm() {
    const category = els.categorySelect.value === NEW_CATEGORY ? els.cardForm.elements.newCategory.value.trim() : els.categorySelect.value;
    return normalizeCard({ id: state.editingId || createId(), category, proficiency: els.cardForm.elements.proficiency.value, question: els.cardForm.elements.question.value, briefAnswer: els.cardForm.elements.briefAnswer.value, detailedAnswer: els.cardForm.elements.detailedAnswer.value });
  }

  function saveForm(event) {
    event.preventDefault(); const card = cardFromForm();
    if (!card.category) { els.cardForm.elements.newCategory.focus(); return; }
    const duplicate = state.cards.find((item) => item.id !== card.id && item.category === card.category && item.question === card.question);
    if (duplicate && !confirm("该分类下已有相同题面。仍要保存一张重复卡片吗？")) return;
    const index = state.cards.findIndex((item) => item.id === card.id); if (index >= 0) state.cards[index] = card; else state.cards.unshift(card);
    state.activeId = card.id; state.preferredCategory = card.category; saveCards(); exitEdit(true); state.revealStage = 0; render(); showToast(index >= 0 ? "卡片已更新" : "卡片已保存");
  }
  function editCard() {
    const card = activeCard(); if (!card) return; state.editingId = card.id; renderCategorySelect();
    state.preferredCategory = card.category; els.categorySelect.value = card.category; els.cardForm.elements.proficiency.value = card.proficiency; els.cardForm.elements.question.value = card.question; els.cardForm.elements.briefAnswer.value = card.briefAnswer; els.cardForm.elements.detailedAnswer.value = card.detailedAnswer;
    els.saveButton.textContent = "保存修改"; els.cancelEditButton.classList.remove("hidden"); state.dirty = false; els.cardForm.elements.question.focus();
  }
  function confirmDiscard() { return !state.dirty || confirm("当前表单有未保存的内容，确定放弃吗？"); }
  function discardDraftForNavigation() { if (!state.dirty) return true; if (!confirmDiscard()) return false; exitEdit(true); return true; }
  function exitEdit(force) {
    if (!force && !confirmDiscard()) return false;
    state.editingId = null; state.dirty = false; els.cardForm.reset(); renderCategorySelect(); els.cardForm.elements.proficiency.value = "生疏"; els.saveButton.textContent = "保存卡片"; els.cancelEditButton.classList.add("hidden"); return true;
  }
  function newCard() { if (!exitEdit(false)) return; els.cardForm.elements.question.focus(); }
  function deleteCard() {
    const card = activeCard(); if (!card || !confirm(`确定删除这张卡片吗？\n\n${card.question}`)) return;
    state.cards = state.cards.filter((item) => item.id !== card.id); state.activeId = null; saveCards(); exitEdit(true); render(); showToast("卡片已删除");
  }
  function updateProficiency(proficiency) {
    const card = activeCard(); if (!card) return;
    const cards = filteredCards(); const index = cards.findIndex((item) => item.id === card.id); const nextId = cards.length > 1 ? cards[(index + 1) % cards.length].id : card.id;
    card.proficiency = proficiency; state.activeId = nextId; state.revealStage = 0; saveCards(); render(); showToast(`已标记为“${proficiency}”，已进入下一张`);
  }
  function flip() { if (activeCard()) { state.revealStage = (state.revealStage + 1) % 3; renderCard(); } }
  function moveCard(direction) { if (!discardDraftForNavigation()) return; const cards = filteredCards(); if (!cards.length) return; const index = Math.max(0, cards.findIndex((card) => card.id === state.activeId)); state.activeId = cards[(index + direction + cards.length) % cards.length].id; state.revealStage = 0; render(); }

  async function generateAiCards() {
    const source = els.aiSourceInput.value.trim(); if (!source) { els.aiSourceInput.focus(); showToast("请先粘贴要整理的学习内容"); return; }
    els.generateBulkButton.disabled = true; els.generateBulkButton.textContent = "正在生成…"; els.aiStatus.textContent = "DeepSeek 正在整理为可主动回忆的卡片。";
    const allowedCategories = categories().join("、");
    const prompt = `请把下面的学习内容整理成 1 到 12 张中文技术面试记忆卡。\n\n只输出 JSON 数组，不要 Markdown，不要解释。数组每项严格为：{"category":"分类","proficiency":"生疏","question":"题面","briefAnswer":"精简答案","detailedAnswer":"详细答案"}。\n要求：题面是可独立回答的面试问题；briefAnswer 用 1 到 3 句讲核心结论；detailedAnswer 补充原理、流程、边界和面试表达；确实需要强调的关键结论用 **重点内容** 包裹；proficiency 固定为“生疏”；category 必须从这些已有分类中选择：${allowedCategories}。\n\n学习内容：\n${source}`;
    try {
      const response = await fetch("/api/generate-card", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "deepseek-v4-flash", temperature: 0.2, messages: [{ role: "system", content: "你是严谨的 Java 后端面试复习助手，只能输出有效 JSON。" }, { role: "user", content: prompt }] }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "DeepSeek 请求失败");
      const cards = parseAiCards(data.content).map((card) => normalizeCard({ ...card, id: createId(), proficiency: "生疏" })).filter((card) => card.question && card.briefAnswer && card.detailedAnswer);
      if (!cards.length) throw new Error("没有解析到有效卡片，请换一段更完整的学习笔记重试。");
      state.aiCards = cards; renderAiPreview(); els.aiStatus.textContent = "预览已生成，请确认后导入。";
    } catch (error) { state.aiCards = []; els.aiPreview.classList.add("hidden"); els.aiStatus.textContent = `生成失败：${error.message}`; }
    finally { els.generateBulkButton.disabled = false; els.generateBulkButton.textContent = "生成卡片预览"; }
  }
  function parseAiCards(content) {
    const raw = String(content || "").replace(/```json|```/gi, "").trim(); let parsed;
    try { parsed = JSON.parse(raw); } catch { const match = raw.match(/\[[\s\S]*\]/); if (!match) throw new Error("返回内容不是 JSON 数组"); parsed = JSON.parse(match[0]); }
    return Array.isArray(parsed) ? parsed : Array.isArray(parsed.cards) ? parsed.cards : [];
  }
  function renderAiPreview() {
    els.aiPreview.classList.toggle("hidden", !state.aiCards.length); els.aiPreviewCount.textContent = `已生成 ${state.aiCards.length} 张卡片，请先快速核对：`;
    els.aiPreviewList.innerHTML = state.aiCards.map((card, index) => `<article><strong>${index + 1}. ${escapeHtml(card.question)}</strong><span>${escapeHtml(card.category)}</span></article>`).join("");
  }
  function importAiCards() {
    const existing = new Set(state.cards.map((card) => `${card.category}\u0000${card.question}`)); const cards = state.aiCards.filter((card) => !existing.has(`${card.category}\u0000${card.question}`));
    if (!cards.length) { showToast("预览中的卡片均已存在，未重复导入"); return; }
    state.cards.unshift(...cards); state.activeId = cards[0].id; state.aiCards = []; els.aiPreview.classList.add("hidden"); els.aiSourceInput.value = ""; saveCards(); state.revealStage = 0; render(); showToast(`已导入 ${cards.length} 张卡片`);
  }
  function exportCards() {
    const payload = { app: "java-interview-flashcards", version: 2, exportedAt: new Date().toISOString(), cards: state.cards };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = `八股记忆卡片-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url); showToast("备份文件已导出");
  }
  function importCards(file) {
    const reader = new FileReader(); reader.onload = () => { try { const payload = JSON.parse(reader.result); const cards = Array.isArray(payload) ? payload : payload.cards; if (!Array.isArray(cards)) throw new Error("没有找到 cards 数组"); if (!confirm("导入将替换当前所有八股卡片，确定继续吗？")) return; state.cards = cards.map(normalizeCard); state.activeId = null; saveCards(); render(); showToast(`已导入 ${state.cards.length} 张卡片`); } catch (error) { showToast(`导入失败：${error.message}`); } }; reader.readAsText(file);
  }

  els.searchInput.oninput = (event) => { if (!discardDraftForNavigation()) { event.target.value = state.query; return; } state.query = event.target.value; state.revealStage = 0; render(); };
  els.flipButton.onclick = flip; els.flashcard.onclick = () => { if (state.revealStage < 2) flip(); }; els.flashcard.onkeydown = (event) => { if ((event.key === "Enter" || event.key === " ") && state.revealStage < 2) { event.preventDefault(); flip(); } };
  els.weakButton.onclick = () => updateProficiency("生疏"); els.normalButton.onclick = () => updateProficiency("一般"); els.masteredButton.onclick = () => updateProficiency("熟练");
  els.cardForm.onsubmit = saveForm; els.cardForm.addEventListener("input", () => { state.dirty = true; }); els.cardForm.addEventListener("change", () => { state.dirty = true; });
  els.categorySelect.onchange = () => { if (els.categorySelect.value !== NEW_CATEGORY) state.preferredCategory = els.categorySelect.value; toggleNewCategoryField(); }; els.newCardButton.onclick = newCard; els.cancelEditButton.onclick = () => exitEdit(false); els.editButton.onclick = editCard; els.deleteButton.onclick = deleteCard;
  els.generateBulkButton.onclick = generateAiCards; els.importAiCardsButton.onclick = importAiCards; els.exportButton.onclick = exportCards; els.importInput.onchange = (event) => { if (event.target.files[0]) importCards(event.target.files[0]); event.target.value = ""; };
  document.onkeydown = (event) => { if (event.target.matches("input, textarea, select")) return; if (event.key.toLowerCase() === "f") flip(); if (event.key === "1") updateProficiency("生疏"); if (event.key === "2") updateProficiency("一般"); if (event.key === "3") updateProficiency("熟练"); if (event.key === "ArrowLeft") moveCard(-1); if (event.key === "ArrowRight") moveCard(1); };
  window.addEventListener("beforeunload", (event) => { if (state.dirty) { event.preventDefault(); event.returnValue = ""; } });
  render();
})();
