/* ==========================================================================
   LexiQuest: English Arcade - Master App Orchestrator (script.js)
   - View Navigation & State Sync
   - 500+ Character Shop with Pagination & Transactions
   - Inventory & Mascot Customization
   - 32 Achievement Evaluator & Toast Alerts
   - Confetti Particle Physics
   - JSON Save Import/Export Engine
   ========================================================================== */

window.LexiApp = (function () {
  let currentUser = null;
  let activeView = "home";
  let shopPage = 1;
  const SHOP_PAGE_SIZE = 20;

  // 1. INITIALIZATION
  function init() {
    currentUser = window.LexiAuth.init();
    setupTheme();
    setupAudioListeners();
    setupNavigation();
    setupAuthModal();
    setupDailyReward();
    setupShop();
    setupInventory();
    setupCommunity();
    setupParty();
    setupLeaderboard();
    setupSettings();
    setupConfetti();

    // Render Initial State
    updateUserInterface();
    renderFeaturedGames();
    renderGamesLibrary();
    renderAchievements();

    // Global helper for launching game
    window.LexiQuest = {
      launchGame: (gameId) => {
        switchView("arena");
        window.LexiGames.launch(gameId, handleGameEnd);
      }
    };
  }

  // 2. THEME & APPEARANCE
  function setupTheme() {
    const savedTheme = localStorage.getItem("lexiquest_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    const toggleBtn = document.getElementById("btn-theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("lexiquest_theme", next);
        updateThemeIcon(next);
        window.LexiAudio.playClick();
      });
    }
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  // 3. AUDIO TOGGLES
  function setupAudioListeners() {
    const soundBtn = document.getElementById("btn-sound-toggle");
    const musicBtn = document.getElementById("btn-music-toggle");

    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const active = !window.LexiAudio.isSfx();
        window.LexiAudio.setSfx(active);
        soundBtn.classList.toggle("active", active);
        document.getElementById("sound-icon").textContent = active ? "🔊" : "🔇";
        window.LexiAudio.playClick();
      });
    }

    if (musicBtn) {
      musicBtn.addEventListener("click", () => {
        const active = !window.LexiAudio.isMusic();
        window.LexiAudio.setMusic(active);
        musicBtn.classList.toggle("active", active);
        document.getElementById("music-icon").textContent = active ? "🎶" : "🎵";
        window.LexiAudio.playClick();
      });
    }
  }

  // 4. NAVIGATION SYSTEM
  function setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-link, .mobile-nav-btn");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetView = btn.dataset.view;
        if (targetView) {
          switchView(targetView);
          window.LexiAudio.playClick();
        }
      });
    });

    // Logo click returns to home
    const logo = document.getElementById("brand-logo");
    if (logo) {
      logo.addEventListener("click", () => switchView("home"));
    }

    // Quick Play Button
    const qpBtn = document.getElementById("btn-quick-play");
    if (qpBtn) {
      qpBtn.addEventListener("click", () => {
        const games = window.LexiGames.list;
        const randomGame = games[Math.floor(Math.random() * games.length)];
        window.LexiQuest.launchGame(randomGame.id);
      });
    }

    // Direct link buttons
    const browseGamesBtn = document.getElementById("btn-hero-explore-games");
    if (browseGamesBtn) browseGamesBtn.addEventListener("click", () => switchView("games"));

    const heroPartyBtn = document.getElementById("btn-hero-party");
    if (heroPartyBtn) heroPartyBtn.addEventListener("click", () => switchView("party"));

    const allGamesBtn = document.getElementById("btn-home-see-all-games");
    if (allGamesBtn) allGamesBtn.addEventListener("click", () => switchView("games"));

    const quitArenaBtn = document.getElementById("btn-quit-arena");
    if (quitArenaBtn) {
      quitArenaBtn.addEventListener("click", () => {
        window.LexiGames.cleanup();
        switchView("games");
      });
    }

    const dashShopBtn = document.getElementById("btn-dash-open-shop");
    if (dashShopBtn) dashShopBtn.addEventListener("click", () => switchView("shop"));

    const invShopBtn = document.getElementById("btn-inv-to-shop");
    if (invShopBtn) invShopBtn.addEventListener("click", () => switchView("shop"));
  }

  function switchView(viewId) {
    activeView = viewId;
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) targetSection.classList.add("active");

    // Sync active nav tabs
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.dataset.view === viewId);
    });
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Refresh view specific components
    if (viewId === "shop") renderShopGrid();
    else if (viewId === "inventory") renderInventoryGrid();
    else if (viewId === "community") renderCommunityPosts();
    else if (viewId === "leaderboard") renderLeaderboard();
    else if (viewId === "achievements") renderAchievements();
  }

  // 5. USER PROFILE & ECONOMY SYNC
  function updateUserInterface() {
    if (!currentUser) return;

    // Calculate level based on XP
    const calculatedLevel = Math.floor(Math.sqrt(currentUser.xp / 50)) + 1;
    currentUser.level = calculatedLevel;

    // Equipped character info
    const equipped = window.LexiData.characters.find(c => c.id === currentUser.equippedCharacterId) || window.LexiData.characters[0];
    currentUser.equippedCharacter = equipped;

    // Header Pill
    const pill = document.getElementById("header-user-pill");
    const pillAvatar = document.getElementById("header-user-avatar");
    const pillName = document.getElementById("header-user-name");
    const pillCoins = document.getElementById("header-user-coins");
    const pillLevel = document.getElementById("header-user-level");

    if (pill && pillAvatar && pillName) {
      pill.style.display = "flex";
      pillAvatar.textContent = equipped.icon;
      pillName.textContent = currentUser.username;
      if (pillCoins) pillCoins.textContent = currentUser.coins.toLocaleString();
      if (pillLevel) pillLevel.textContent = currentUser.level;
    }

    // Home Stats
    const homeCoins = document.getElementById("home-stat-coins");
    const homeLevel = document.getElementById("home-stat-level");
    const homeAcc = document.getElementById("home-stat-accuracy");
    const homeChars = document.getElementById("home-stat-chars");
    const homeMascot = document.getElementById("hero-center-mascot");

    if (homeCoins) homeCoins.textContent = `${currentUser.coins.toLocaleString()} Coins`;
    if (homeLevel) homeLevel.textContent = `Level ${currentUser.level}`;
    const totalAns = currentUser.correctAnswers + currentUser.incorrectAnswers;
    const accRate = totalAns > 0 ? Math.round((currentUser.correctAnswers / totalAns) * 100) : 100;
    if (homeAcc) homeAcc.textContent = `${accRate}%`;
    if (homeChars) homeChars.textContent = `${currentUser.ownedCharacters.length} / 520`;
    if (homeMascot) homeMascot.textContent = equipped.icon;

    // Dashboard Stats
    const dashAvatar = document.getElementById("dash-avatar-display");
    const dashUser = document.getElementById("dash-profile-username");
    const dashEquipped = document.getElementById("dash-equipped-char-title");
    const dashLvlText = document.getElementById("dash-level-text");
    const dashXpBar = document.getElementById("dash-xp-bar");
    const dashXpText = document.getElementById("dash-xp-progress-text");
    const dashCoins = document.getElementById("dash-coins-val");
    const dashAccuracy = document.getElementById("dash-accuracy-val");
    const dashWon = document.getElementById("dash-games-won-val");
    const dashCorrect = document.getElementById("dash-correct-val");
    const dashCollectionBar = document.getElementById("dash-collection-bar");
    const dashCollectionText = document.getElementById("dash-collection-count-text");

    if (dashAvatar) dashAvatar.textContent = equipped.icon;
    if (dashUser) dashUser.textContent = currentUser.username;
    if (dashEquipped) dashEquipped.textContent = `Equipped: ${equipped.name} (${equipped.rarity.toUpperCase()})`;
    if (dashLvlText) dashLvlText.textContent = currentUser.level;

    // Level XP calculation
    const currentLvlBaseXp = Math.pow(currentUser.level - 1, 2) * 50;
    const nextLvlBaseXp = Math.pow(currentUser.level, 2) * 50;
    const xpIntoLevel = currentUser.xp - currentLvlBaseXp;
    const xpNeededForLevel = nextLvlBaseXp - currentLvlBaseXp;
    const xpPercent = Math.min(100, Math.max(5, Math.round((xpIntoLevel / Math.max(1, xpNeededForLevel)) * 100)));

    if (dashXpBar) dashXpBar.style.width = `${xpPercent}%`;
    if (dashXpText) dashXpText.textContent = `${xpIntoLevel} / ${xpNeededForLevel} XP`;
    if (dashCoins) dashCoins.textContent = currentUser.coins.toLocaleString();
    if (dashAccuracy) dashAccuracy.textContent = `${accRate}%`;
    if (dashWon) dashWon.textContent = currentUser.gamesWon;
    if (dashCorrect) dashCorrect.textContent = currentUser.correctAnswers;

    const collPercent = ((currentUser.ownedCharacters.length / 520) * 100).toFixed(1);
    if (dashCollectionBar) dashCollectionBar.style.width = `${collPercent}%`;
    if (dashCollectionText) dashCollectionText.textContent = `${currentUser.ownedCharacters.length} / 520 (${collPercent}%)`;

    // Shop Balance Display
    const shopCoins = document.getElementById("shop-balance-coins");
    if (shopCoins) shopCoins.textContent = currentUser.coins.toLocaleString();

    // Persist changes
    window.LexiAuth.updateUser(currentUser);
    evaluateAchievements();
  }

  // 6. DAILY LOGIN REWARD
  function setupDailyReward() {
    const claimBtn = document.getElementById("btn-claim-daily");
    if (!claimBtn) return;

    claimBtn.addEventListener("click", () => {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - (currentUser.lastDailyReward || 0) > oneDay) {
        currentUser.coins += 100;
        currentUser.xp += 150;
        currentUser.lastDailyReward = now;
        updateUserInterface();
        showToast("🎁 Daily Reward Claimed!", "+100 Coins and +150 XP awarded!");
        window.LexiAudio.playVictory();
        triggerConfetti();
      } else {
        showToast("⏳ Already Claimed", "Your daily gift refreshes every 24 hours. Keep learning!");
        window.LexiAudio.playWrong();
      }
    });
  }

  // 7. AUTHENTICATION MODAL (BROWSER-BASED)
  function setupAuthModal() {
    const modal = document.getElementById("modal-auth");
    const openBtn = document.getElementById("btn-open-auth");
    const closeBtn = document.getElementById("btn-close-auth");
    const tabLogin = document.getElementById("tab-auth-login");
    const tabSignup = document.getElementById("tab-auth-signup");
    const formLogin = document.getElementById("form-login");
    const formSignup = document.getElementById("form-signup");
    const switchBtn = document.getElementById("btn-toggle-auth-mode");

    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener("click", () => {
        modal.classList.add("active");
        window.LexiAudio.playClick();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    function setAuthMode(isSignup) {
      if (isSignup) {
        tabLogin.classList.remove("active");
        tabSignup.classList.add("active");
        formLogin.style.display = "none";
        formSignup.style.display = "block";
        switchBtn.textContent = "Switch to Login";
      } else {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        formLogin.style.display = "block";
        formSignup.style.display = "none";
        switchBtn.textContent = "Switch to Sign Up";
      }
    }

    if (tabLogin) tabLogin.addEventListener("click", () => setAuthMode(false));
    if (tabSignup) tabSignup.addEventListener("click", () => setAuthMode(true));
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        const isSignup = formSignup.style.display === "block";
        setAuthMode(!isSignup);
      });
    }

    // Handle Login Submit
    if (formLogin) {
      formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userField = document.getElementById("login-username").value;
        const passField = document.getElementById("login-password").value;
        try {
          currentUser = await window.LexiAuth.logIn(userField, passField);
          modal.classList.remove("active");
          updateUserInterface();
          showToast("👋 Welcome Back!", `Logged in as ${currentUser.username}`);
          window.LexiAudio.playLevelUp();
        } catch (err) {
          showToast("❌ Login Error", err.message);
          window.LexiAudio.playWrong();
        }
      });
    }

    // Handle Sign Up Submit
    if (formSignup) {
      formSignup.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userField = document.getElementById("signup-username").value;
        const passField = document.getElementById("signup-password").value;
        const confirmField = document.getElementById("signup-password-confirm").value;

        if (passField !== confirmField) {
          showToast("❌ Validation Error", "Passwords do not match!");
          window.LexiAudio.playWrong();
          return;
        }

        try {
          currentUser = await window.LexiAuth.signUp(userField, passField);
          modal.classList.remove("active");
          updateUserInterface();
          showToast("🎉 Profile Created!", `Welcome to LexiQuest, ${currentUser.username}!`);
          window.LexiAudio.playVictory();
          triggerConfetti();
        } catch (err) {
          showToast("❌ Sign Up Error", err.message);
          window.LexiAudio.playWrong();
        }
      });
    }
  }

  // 8. RENDER GAMES LIBRARY (20+ MODES)
  function renderFeaturedGames() {
    const featuredContainer = document.getElementById("home-featured-games");
    if (!featuredContainer) return;
    const featured = window.LexiGames.list.slice(0, 6);
    featuredContainer.innerHTML = featured.map(g => createGameCardHtml(g)).join("");
    attachGameCardEvents(featuredContainer);
  }

  function renderGamesLibrary(filterCat = "all", searchTxt = "") {
    const container = document.getElementById("full-games-grid");
    if (!container) return;

    let list = window.LexiGames.list;
    if (filterCat !== "all") {
      list = list.filter(g => g.category === filterCat);
    }
    if (searchTxt.trim()) {
      const q = searchTxt.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q));
    }

    container.innerHTML = list.map(g => createGameCardHtml(g)).join("");
    attachGameCardEvents(container);

    // Setup filter chips
    const filterButtons = document.querySelectorAll("#game-category-filters .chip");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderGamesLibrary(btn.dataset.category, document.getElementById("game-search-input").value);
        window.LexiAudio.playClick();
      });
    });

    const searchInput = document.getElementById("game-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const activeChip = document.querySelector("#game-category-filters .chip.active");
        renderGamesLibrary(activeChip ? activeChip.dataset.category : "all", e.target.value);
      });
    }
  }

  function createGameCardHtml(g) {
    return `
      <div class="game-card" data-game-id="${g.id}">
        <div class="game-card-top">
          <div class="game-card-icon">${g.icon}</div>
          <span class="game-card-badge">${g.difficulty}</span>
        </div>
        <div class="game-card-info">
          <h3>${g.name}</h3>
          <p>${g.desc}</p>
        </div>
        <div class="game-card-footer">
          <span class="game-card-mechanic">⚙️ ${g.mechanic}</span>
          <button class="btn btn-primary btn-sm">PLAY →</button>
        </div>
      </div>
    `;
  }

  function attachGameCardEvents(container) {
    container.querySelectorAll(".game-card").forEach(card => {
      card.addEventListener("click", () => {
        const gameId = card.dataset.gameId;
        window.LexiQuest.launchGame(gameId);
      });
    });
  }

  // Handle Game Finish Callback
  function handleGameEnd(stats) {
    currentUser.gamesPlayed++;
    currentUser.correctAnswers += stats.correct;
    currentUser.incorrectAnswers += stats.incorrect;
    currentUser.coins += stats.earnedCoins;
    currentUser.xp += stats.earnedXp;
    if (stats.won) currentUser.gamesWon++;

    updateUserInterface();
  }

  // 9. SHOP SYSTEM (500+ PROGRAMMATIC CHARACTERS)
  let activeShopFilter = { rarity: "all", category: "all", search: "" };

  function setupShop() {
    const rarityChips = document.querySelectorAll("#shop-rarity-filters .chip");
    rarityChips.forEach(chip => {
      chip.addEventListener("click", () => {
        rarityChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        activeShopFilter.rarity = chip.dataset.rarity;
        shopPage = 1;
        renderShopGrid();
        window.LexiAudio.playClick();
      });
    });

    const categorySelect = document.getElementById("shop-category-select");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        activeShopFilter.category = e.target.value;
        shopPage = 1;
        renderShopGrid();
      });
    }

    const searchInput = document.getElementById("shop-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        activeShopFilter.search = e.target.value;
        shopPage = 1;
        renderShopGrid();
      });
    }

    // Pagination
    const prevBtn = document.getElementById("btn-shop-prev");
    const nextBtn = document.getElementById("btn-shop-next");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (shopPage > 1) {
          shopPage--;
          renderShopGrid();
          window.LexiAudio.playClick();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        shopPage++;
        renderShopGrid();
        window.LexiAudio.playClick();
      });
    }
  }

  function getFilteredShopCharacters() {
    let list = window.LexiData.characters;
    if (activeShopFilter.rarity !== "all") {
      list = list.filter(c => c.rarity === activeShopFilter.rarity);
    }
    if (activeShopFilter.category !== "all") {
      list = list.filter(c => c.category === activeShopFilter.category);
    }
    if (activeShopFilter.search.trim()) {
      const q = activeShopFilter.search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return list;
  }

  function renderShopGrid() {
    const grid = document.getElementById("shop-characters-grid");
    if (!grid) return;

    const filtered = getFilteredShopCharacters();
    const totalPages = Math.max(1, Math.ceil(filtered.length / SHOP_PAGE_SIZE));
    if (shopPage > totalPages) shopPage = totalPages;

    const startIdx = (shopPage - 1) * SHOP_PAGE_SIZE;
    const pageItems = filtered.slice(startIdx, startIdx + SHOP_PAGE_SIZE);

    const pageInfo = document.getElementById("shop-page-info");
    if (pageInfo) pageInfo.textContent = `Page ${shopPage} of ${totalPages} (${filtered.length} mascots)`;

    grid.innerHTML = pageItems.map(c => {
      const isOwned = currentUser.ownedCharacters.includes(c.id);
      const isEquipped = currentUser.equippedCharacterId === c.id;

      return `
        <div class="character-card ${c.rarity}">
          <span class="character-rarity-badge rarity-${c.rarity}">${c.rarity}</span>
          <div class="character-avatar-wrap">${c.icon}</div>
          <div class="character-card-name">${c.name}</div>
          <div class="character-card-desc">${c.description}</div>
          <div class="character-card-action">
            ${isEquipped ? `
              <div class="equipped-tag">⭐ Equipped</div>
            ` : isOwned ? `
              <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="window.LexiApp.equipCharacter('${c.id}')">
                Equip Mascot
              </button>
            ` : `
              <button class="btn btn-accent btn-sm" style="width: 100%;" onclick="window.LexiApp.promptPurchase('${c.id}')">
                🪙 Buy ${c.price}
              </button>
            `}
          </div>
        </div>
      `;
    }).join("");
  }

  // Character Purchase Flow with Modal
  function promptPurchase(charId) {
    const char = window.LexiData.characters.find(c => c.id === charId);
    if (!char) return;

    if (currentUser.ownedCharacters.includes(char.id)) {
      showToast("🎒 Already Owned", "You already own this character!");
      return;
    }

    if (currentUser.coins < char.price) {
      showToast("🪙 Insufficient Coins", `You need ${char.price} coins, but only have ${currentUser.coins}. Play more games!`);
      window.LexiAudio.playWrong();
      return;
    }

    const modal = document.getElementById("modal-purchase");
    const avatar = document.getElementById("purchase-avatar");
    const name = document.getElementById("purchase-char-name");
    const rarity = document.getElementById("purchase-rarity-badge");
    const desc = document.getElementById("purchase-desc");
    const priceTag = document.getElementById("purchase-price-tag");
    const confirmBtn = document.getElementById("btn-confirm-purchase");
    const cancelBtn = document.getElementById("btn-cancel-purchase");

    avatar.textContent = char.icon;
    name.textContent = char.name;
    rarity.textContent = char.rarity.toUpperCase();
    rarity.className = `game-card-badge rarity-${char.rarity}`;
    desc.textContent = char.description;
    priceTag.textContent = char.price.toLocaleString();

    modal.classList.add("active");
    window.LexiAudio.playClick();

    function onCancel() {
      modal.classList.remove("active");
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
    }

    function onConfirm() {
      modal.classList.remove("active");
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);

      // Execute transaction
      currentUser.coins -= char.price;
      currentUser.ownedCharacters.push(char.id);
      updateUserInterface();
      renderShopGrid();
      showToast("🎉 Mascot Acquired!", `Unlocked ${char.name}! Check your collection.`);
      window.LexiAudio.playAchievement();
      triggerConfetti();
    }

    confirmBtn.addEventListener("click", onConfirm);
    cancelBtn.addEventListener("click", onCancel);
  }

  function equipCharacter(charId) {
    if (!currentUser.ownedCharacters.includes(charId)) return;
    currentUser.equippedCharacterId = charId;
    updateUserInterface();
    renderShopGrid();
    renderInventoryGrid();
    showToast("✨ Mascot Equipped", "Your active avatar has been updated everywhere!");
    window.LexiAudio.playClick();
  }

  // 10. INVENTORY SYSTEM
  function setupInventory() {
    const filterChips = document.querySelectorAll("#inv-filter-chips .chip");
    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderInventoryGrid(chip.dataset.invFilter);
        window.LexiAudio.playClick();
      });
    });

    const searchInput = document.getElementById("inv-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const activeFilter = document.querySelector("#inv-filter-chips .chip.active");
        renderInventoryGrid(activeFilter ? activeFilter.dataset.invFilter : "all", e.target.value);
      });
    }
  }

  function renderInventoryGrid(filterType = "all", searchTxt = "") {
    const grid = document.getElementById("inventory-grid");
    if (!grid) return;

    let owned = window.LexiData.characters.filter(c => currentUser.ownedCharacters.includes(c.id));

    if (filterType === "favorites") {
      owned = owned.filter(c => currentUser.favoriteCharacters && currentUser.favoriteCharacters.includes(c.id));
    } else if (filterType === "rare+") {
      owned = owned.filter(c => ["rare", "epic", "legendary", "mythic"].includes(c.rarity));
    }

    if (searchTxt.trim()) {
      const q = searchTxt.toLowerCase();
      owned = owned.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }

    grid.innerHTML = owned.map(c => {
      const isEquipped = currentUser.equippedCharacterId === c.id;
      const isFav = currentUser.favoriteCharacters && currentUser.favoriteCharacters.includes(c.id);

      return `
        <div class="character-card ${c.rarity}">
          <button style="position: absolute; top: 10px; left: 10px; background: none; border: none; font-size: 1.1rem; cursor: pointer;" onclick="window.LexiApp.toggleFavorite('${c.id}')">
            ${isFav ? '⭐' : '☆'}
          </button>
          <span class="character-rarity-badge rarity-${c.rarity}">${c.rarity}</span>
          <div class="character-avatar-wrap">${c.icon}</div>
          <div class="character-card-name">${c.name}</div>
          <div class="character-card-desc">${c.description}</div>
          <div class="character-card-action">
            ${isEquipped ? `
              <div class="equipped-tag">⭐ Equipped</div>
            ` : `
              <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="window.LexiApp.equipCharacter('${c.id}')">
                Equip Mascot
              </button>
            `}
          </div>
        </div>
      `;
    }).join("");
  }

  function toggleFavorite(charId) {
    if (!Array.isArray(currentUser.favoriteCharacters)) currentUser.favoriteCharacters = [];
    const idx = currentUser.favoriteCharacters.indexOf(charId);
    if (idx >= 0) currentUser.favoriteCharacters.splice(idx, 1);
    else currentUser.favoriteCharacters.push(charId);
    window.LexiAuth.updateUser(currentUser);
    renderInventoryGrid();
    window.LexiAudio.playClick();
  }

  // 11. ACHIEVEMENTS SYSTEM
  function evaluateAchievements() {
    const list = window.LexiData.achievements;
    if (!Array.isArray(currentUser.unlockedAchievements)) currentUser.unlockedAchievements = [];

    list.forEach(ach => {
      if (currentUser.unlockedAchievements.includes(ach.id)) return;
      let unlocked = false;

      switch (ach.id) {
        case "first_game": if (currentUser.gamesPlayed >= 1) unlocked = true; break;
        case "first_win": if (currentUser.gamesWon >= 1) unlocked = true; break;
        case "correct_25": if (currentUser.correctAnswers >= 25) unlocked = true; break;
        case "correct_100": if (currentUser.correctAnswers >= 100) unlocked = true; break;
        case "correct_250": if (currentUser.correctAnswers >= 250) unlocked = true; break;
        case "correct_500": if (currentUser.correctAnswers >= 500) unlocked = true; break;
        case "level_5": if (currentUser.level >= 5) unlocked = true; break;
        case "level_10": if (currentUser.level >= 10) unlocked = true; break;
        case "level_25": if (currentUser.level >= 25) unlocked = true; break;
        case "level_50": if (currentUser.level >= 50) unlocked = true; break;
        case "collector_5": if (currentUser.ownedCharacters.length >= 5) unlocked = true; break;
        case "collector_20": if (currentUser.ownedCharacters.length >= 20) unlocked = true; break;
        case "collector_50": if (currentUser.ownedCharacters.length >= 50) unlocked = true; break;
        case "collector_100": if (currentUser.ownedCharacters.length >= 100) unlocked = true; break;
        case "coin_hoard_500": if (currentUser.coins >= 500) unlocked = true; break;
        case "coin_hoard_2500": if (currentUser.coins >= 2500) unlocked = true; break;
        case "daily_devotee": if (currentUser.lastDailyReward > 0) unlocked = true; break;
      }

      if (unlocked) {
        currentUser.unlockedAchievements.push(ach.id);
        currentUser.coins += ach.rewardCoins;
        currentUser.xp += ach.rewardXp;
        showToast(`🏆 Badge Unlocked: ${ach.title}`, `${ach.desc} (+${ach.rewardCoins} Coins)`);
        window.LexiAudio.playAchievement();
        triggerConfetti();
      }
    });

    renderAchievements();
  }

  function renderAchievements() {
    const container = document.getElementById("achievements-list-container");
    if (!container) return;
    const list = window.LexiData.achievements;
    const unlocked = currentUser.unlockedAchievements || [];

    const summaryBadge = document.getElementById("achievements-summary-badge");
    if (summaryBadge) {
      summaryBadge.textContent = `Unlocked: ${unlocked.length} / ${list.length}`;
    }

    container.innerHTML = list.map(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${ach.icon}</div>
          <div class="achievement-info">
            <h4>${ach.title}</h4>
            <p>${ach.desc}</p>
            <div class="achievement-reward">
              <span>🪙 +${ach.rewardCoins} Coins</span>
              <span>⭐ +${ach.rewardXp} XP</span>
            </div>
          </div>
          ${isUnlocked ? '<span style="color: var(--accent-gold); font-size: 1.3rem;">✓</span>' : '<span style="color: var(--text-dim); font-size: 1.1rem;">🔒</span>'}
        </div>
      `;
    }).join("");
  }

  // 12. COMMUNITY FORUM (LOCAL PERSISTENT)
  function setupCommunity() {
    const submitBtn = document.getElementById("btn-submit-post");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const title = document.getElementById("new-post-title").value;
        const content = document.getElementById("new-post-content").value;
        const tag = document.getElementById("new-post-tag").value;

        if (!title.trim() || !content.trim()) {
          showToast("⚠️ Missing Details", "Please provide both a title and post content.");
          return;
        }

        window.LexiCommunity.createPost(title, content, tag, currentUser);
        document.getElementById("new-post-title").value = "";
        document.getElementById("new-post-content").value = "";
        renderCommunityPosts();
        showToast("🚀 Post Published", "Your study tip has been added to the community!");
        window.LexiAudio.playCorrect();
      });
    }

    // Tag filter buttons
    const tagFilters = document.querySelectorAll("#community-tag-filters .post-tag");
    tagFilters.forEach(tag => {
      tag.addEventListener("click", () => {
        const text = tag.textContent.trim();
        renderCommunityPosts(text === "All" ? null : text);
      });
    });
  }

  function renderCommunityPosts(filterTag = null) {
    const feed = document.getElementById("community-posts-feed");
    if (!feed) return;

    let posts = window.LexiCommunity.getPosts();
    if (filterTag) {
      posts = posts.filter(p => p.tag === filterTag);
    }

    feed.innerHTML = posts.map(post => {
      const isLiked = post.likedBy && post.likedBy.includes(currentUser.username);
      const isOwn = post.author === currentUser.username;

      return `
        <div class="community-post-card" id="post-${post.id}">
          <div class="post-header">
            <div class="post-author-wrap">
              <div class="post-author-avatar">${post.authorIcon || '🦊'}</div>
              <div>
                <div class="post-author-name">${post.author}</div>
                <div class="post-date">English Scholar</div>
              </div>
            </div>
            <span class="post-tag">${post.tag}</span>
          </div>
          <h4 class="post-title">${post.title}</h4>
          <p class="post-content">${post.content}</p>

          <div class="post-actions">
            <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="window.LexiApp.toggleLike('${post.id}')">
              <span>${isLiked ? '❤️' : '🤍'}</span>
              <span>${post.likes} Likes</span>
            </button>
            <button class="post-action-btn" onclick="window.LexiApp.toggleCommentBox('${post.id}')">
              <span>💬</span>
              <span>${post.comments ? post.comments.length : 0} Comments</span>
            </button>
            ${isOwn ? `
              <button class="post-action-btn" style="color: #ef4444; margin-left: auto;" onclick="window.LexiApp.deletePost('${post.id}')">
                🗑️ Delete
              </button>
            ` : ''}
          </div>

          <!-- Comments Section -->
          <div class="comments-section" id="comments-${post.id}" style="display: block;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
              <input type="text" class="post-input" id="input-comment-${post.id}" placeholder="Write a supportive reply..." style="margin-bottom: 0;" />
              <button class="btn btn-primary btn-sm" onclick="window.LexiApp.addComment('${post.id}')">Reply</button>
            </div>
            ${(post.comments || []).map(c => `
              <div class="comment-item">
                <div class="comment-header">
                  <span>${c.icon || '🦊'} ${c.author}</span>
                  <span style="font-size: 0.7rem; color: var(--text-dim);">${c.date}</span>
                </div>
                <div>${c.text}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  function toggleLike(postId) {
    window.LexiCommunity.toggleLike(postId, currentUser.username);
    renderCommunityPosts();
    window.LexiAudio.playClick();
  }

  function addComment(postId) {
    const input = document.getElementById(`input-comment-${postId}`);
    if (!input || !input.value.trim()) return;
    window.LexiCommunity.addComment(postId, input.value, currentUser);
    input.value = "";
    renderCommunityPosts();
    window.LexiAudio.playClick();
  }

  function deletePost(postId) {
    window.LexiCommunity.deletePost(postId, currentUser.username);
    renderCommunityPosts();
    showToast("🗑️ Post Removed", "Your post has been deleted.");
    window.LexiAudio.playClick();
  }

  // 13. PARTY SYSTEM
  function setupParty() {
    const createBtn = document.getElementById("btn-create-party-room");
    const joinBtn = document.getElementById("btn-join-party-room");
    const leaveBtn = document.getElementById("btn-leave-party");
    const addBotBtn = document.getElementById("btn-add-party-bot");
    const startPartyGameBtn = document.getElementById("btn-start-party-game");
    const gameSelector = document.getElementById("party-game-selector");

    if (createBtn) {
      createBtn.addEventListener("click", () => {
        const room = window.LexiParty.createRoom(currentUser);
        openPartyRoom(room);
        window.LexiAudio.playLevelUp();
      });
    }

    if (joinBtn) {
      joinBtn.addEventListener("click", () => {
        const codeInput = document.getElementById("party-join-input");
        const code = codeInput ? codeInput.value.trim() : "";
        if (code.length !== 6) {
          showToast("⚠️ Invalid Code", "Room code must be 6 digits.");
          return;
        }
        const room = window.LexiParty.joinRoom(code, currentUser);
        openPartyRoom(room);
        window.LexiAudio.playClick();
      });
    }

    if (leaveBtn) {
      leaveBtn.addEventListener("click", () => {
        window.LexiParty.leaveRoom(currentUser);
        closePartyRoom();
      });
    }

    if (addBotBtn) {
      addBotBtn.addEventListener("click", () => {
        window.LexiParty.addBotPlayer();
        window.LexiAudio.playClick();
      });
    }

    if (gameSelector) {
      gameSelector.addEventListener("change", (e) => {
        window.LexiParty.setGame(e.target.value);
      });
    }

    if (startPartyGameBtn) {
      startPartyGameBtn.addEventListener("click", () => {
        window.LexiParty.startGame();
      });
    }

    // Inter-tab updates
    window.LexiParty.onUpdate((event) => {
      if (event.type === "UPDATE_ROOM") {
        renderPartyPlayers(event.room);
      } else if (event.type === "START_GAME") {
        showToast("🚀 Party Match Starting!", "Get ready to battle your classmates!");
        window.LexiQuest.launchGame(event.gameId);
      }
    });
  }

  function openPartyRoom(room) {
    document.getElementById("party-hub-selection").style.display = "none";
    document.getElementById("party-room-active").style.display = "block";
    document.getElementById("party-room-code-display").textContent = room.code;
    renderPartyPlayers(room);
  }

  function closePartyRoom() {
    document.getElementById("party-hub-selection").style.display = "grid";
    document.getElementById("party-room-active").style.display = "none";
  }

  function renderPartyPlayers(room) {
    if (!room) return;
    const list = document.getElementById("party-lobby-player-list");
    const count = document.getElementById("party-player-count");
    if (count) count.textContent = room.players.length;

    if (list) {
      list.innerHTML = room.players.map(p => `
        <div class="party-player-item">
          <div class="party-player-info">
            <span style="font-size: 1.4rem;">${p.avatar || '🦊'}</span>
            <span>${p.name} ${p.isHost ? '👑 (Host)' : ''} ${p.isBot ? '🤖 (Bot)' : ''}</span>
          </div>
          <span class="game-card-badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ready</span>
        </div>
      `).join("");
    }
  }

  // 14. LEADERBOARD (LOCAL SCHOLARS)
  function setupLeaderboard() {
    const chips = document.querySelectorAll("#leaderboard-tab-filters .chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderLeaderboard(chip.dataset.board);
        window.LexiAudio.playClick();
      });
    });
  }

  function renderLeaderboard(boardType = "xp") {
    const tbody = document.getElementById("leaderboard-tbody");
    if (!tbody) return;

    const allAccounts = window.LexiAuth.getAllAccounts();
    let scholars = Object.values(allAccounts);

    // Add baseline benchmark competitors for arcade flavor if only 1 account
    if (scholars.length < 5) {
      scholars.push(
        { username: "OxfordSage", level: 18, xp: 14500, coins: 4200, gamesWon: 45, gamesPlayed: 50, correctAnswers: 280, incorrectAnswers: 12 },
        { username: "GrammarNinja", level: 14, xp: 9800, coins: 2800, gamesWon: 32, gamesPlayed: 40, correctAnswers: 195, incorrectAnswers: 20 },
        { username: "SyntaxDragon", level: 12, xp: 7200, coins: 1950, gamesWon: 22, gamesPlayed: 30, correctAnswers: 140, incorrectAnswers: 18 },
        { username: "PixelScholar", level: 9, xp: 4100, coins: 980, gamesWon: 15, gamesPlayed: 25, correctAnswers: 90, incorrectAnswers: 22 }
      );
    }

    if (boardType === "xp") scholars.sort((a, b) => b.xp - a.xp);
    else if (boardType === "coins") scholars.sort((a, b) => b.coins - a.coins);
    else if (boardType === "wins") scholars.sort((a, b) => b.gamesWon - a.gamesWon);
    else if (boardType === "accuracy") {
      scholars.sort((a, b) => {
        const accA = (a.correctAnswers / Math.max(1, a.correctAnswers + a.incorrectAnswers));
        const accB = (b.correctAnswers / Math.max(1, b.correctAnswers + b.incorrectAnswers));
        return accB - accA;
      });
    }

    const rankMedals = ["🥇", "🥈", "🥉"];
    tbody.innerHTML = scholars.slice(0, 10).map((s, idx) => {
      const medal = rankMedals[idx] || `#${idx + 1}`;
      const total = (s.correctAnswers || 0) + (s.incorrectAnswers || 0);
      const acc = total > 0 ? Math.round((s.correctAnswers / total) * 100) : 100;

      return `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 0.85rem 0.5rem; font-weight: 800; font-size: 1.1rem;">${medal}</td>
          <td style="padding: 0.85rem 1rem; font-weight: 800;">
            ${s.username === currentUser.username ? `${s.username} (You)` : s.username}
          </td>
          <td style="padding: 0.85rem 1rem; color: #818cf8; font-weight: 700;">Lv. ${s.level || 1}</td>
          <td style="padding: 0.85rem 1rem; color: var(--accent-gold); font-weight: 700;">🪙 ${(s.coins || 0).toLocaleString()}</td>
          <td style="padding: 0.85rem 1rem; color: #34d399; font-weight: 700;">${acc}%</td>
          <td style="padding: 0.85rem 1rem; text-align: right; font-weight: 800;">${(s.xp || 0).toLocaleString()} XP</td>
        </tr>
      `;
    }).join("");
  }

  // 15. SETTINGS & SAVE IMPORT/EXPORT
  function setupSettings() {
    const exportBtn = document.getElementById("btn-export-save");
    const importInput = document.getElementById("input-import-save");
    const resetBtn = document.getElementById("btn-reset-data");
    const sfxCheckbox = document.getElementById("setting-sfx-toggle");
    const musicCheckbox = document.getElementById("setting-music-toggle");
    const settingsThemeBtn = document.getElementById("btn-settings-theme");

    if (sfxCheckbox) {
      sfxCheckbox.addEventListener("change", (e) => {
        window.LexiAudio.setSfx(e.target.checked);
      });
    }

    if (musicCheckbox) {
      musicCheckbox.addEventListener("change", (e) => {
        window.LexiAudio.setMusic(e.target.checked);
      });
    }

    if (settingsThemeBtn) {
      settingsThemeBtn.addEventListener("click", () => {
        const toggleBtn = document.getElementById("btn-theme-toggle");
        if (toggleBtn) toggleBtn.click();
      });
    }

    // Export Save JSON
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const backupData = {
          version: "1.0",
          exportDate: new Date().toISOString(),
          accounts: window.LexiAuth.getAllAccounts(),
          currentUser: currentUser.username,
          community: window.LexiCommunity.getPosts()
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `lexiquest_backup_${currentUser.username}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("📦 Save Exported", "Save file downloaded to your device!");
        window.LexiAudio.playCorrect();
      });
    }

    // Import Save JSON
    if (importInput) {
      importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (!data.accounts || !data.version) {
              throw new Error("Invalid save file structure.");
            }
            localStorage.setItem("lexiquest_accounts_v1", JSON.stringify(data.accounts));
            if (data.community) {
              localStorage.setItem("lexiquest_community_posts_v1", JSON.stringify(data.community));
            }
            showToast("✅ Save Imported!", "Game state restored! Reloading profile...");
            window.LexiAudio.playVictory();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (err) {
            showToast("❌ Import Failed", "Corrupt or unrecognized save file.");
            window.LexiAudio.playWrong();
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset Local Data
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("⚠️ Are you sure you want to reset all local account, coin, and character data? This cannot be undone.")) {
          localStorage.clear();
          showToast("♻️ Reset Complete", "All local game state has been cleared.");
          setTimeout(() => window.location.reload(), 1000);
        }
      });
    }
  }

  // 16. TOAST NOTIFICATION CENTER
  function showToast(title, message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <div class="toast-icon">⚡</div>
      <div class="toast-content">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 17. CONFETTI PARTICLE ENGINE
  let confettiParticles = [];
  let confettiAnim = null;

  function setupConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();
  }

  function triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    confettiParticles = [];
    const colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

    for (let i = 0; i < 90; i++) {
      confettiParticles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10
      });
    }

    if (confettiAnim) cancelAnimationFrame(confettiAnim);

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        if (p.y < canvas.height) alive = true;
      });

      if (alive) confettiAnim = requestAnimationFrame(update);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    update();
  }

  // Start on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    switchView,
    promptPurchase,
    equipCharacter,
    toggleFavorite,
    toggleLike,
    addComment,
    deletePost
  };
})();
