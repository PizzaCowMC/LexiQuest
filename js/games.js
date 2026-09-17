/* ==========================================================================
   LexiQuest: English Arcade - Games Engine (js/games.js)
   - 21 Genuinely Distinct English Game Modes
   - Unique Presentation, Gameplay Mechanics, Interactive DOM/Canvas & Scoring
   ========================================================================== */

window.LexiGames = (function () {
  const gamesList = [
    {
      id: "vocab-race",
      name: "Vocabulary Race",
      icon: "🏎️",
      category: "vocabulary",
      mechanic: "Speed Lane Runner",
      difficulty: "Normal",
      desc: "Answer vocabulary definitions swiftly to turbo-boost your dragster past the AI rival to the finish line!"
    },
    {
      id: "grammar-battle",
      name: "Grammar Battle",
      icon: "⚔️",
      category: "grammar",
      mechanic: "Turn-Based RPG",
      difficulty: "Hard",
      desc: "Cast syntactic spells and shields by correcting grammar errors to defeat the ferocious Syntax Dragon!"
    },
    {
      id: "word-tower",
      name: "Word Tower",
      icon: "🏗️",
      category: "arcade",
      mechanic: "Stacking Builder",
      difficulty: "Normal",
      desc: "Drop precision architectural blocks from a crane by selecting valid definitions. Stack the tallest skyscraper!"
    },
    {
      id: "sentence-scramble",
      name: "Sentence Scramble",
      icon: "🧩",
      category: "grammar",
      mechanic: "Tile Reordering",
      difficulty: "Easy",
      desc: "Click or tap jumbled word blocks in the precise grammatical order to reconstruct poetic English sentences."
    },
    {
      id: "spelling-sprint",
      name: "Spelling Sprint",
      icon: "⚡",
      category: "spelling",
      mechanic: "Rapid Flashcards",
      difficulty: "Normal",
      desc: "A rapid-fire spelling bee with an 8-second heartbeat timer! Spot true spellings from deceptive lookalikes."
    },
    {
      id: "treasure-words",
      name: "Treasure Words",
      icon: "💎",
      category: "strategy",
      mechanic: "Memory Tile Match",
      difficulty: "Normal",
      desc: "Explore a 4x4 stone dungeon. Flip stone tiles to match synonyms and antonyms before your torches burn out."
    },
    {
      id: "word-duel",
      name: "Word Duel",
      icon: "🤠",
      category: "arcade",
      mechanic: "Western Quick-Draw",
      difficulty: "Hard",
      desc: "Stare down an outlaw in the dusty frontier. When DRAW flashes, react instantly to select the target definition!"
    },
    {
      id: "english-tycoon",
      name: "English Tycoon",
      icon: "🏭",
      category: "strategy",
      mechanic: "Idle Production Line",
      difficulty: "Easy",
      desc: "Answer questions to generate Grammar Wattage. Invest in printing presses and dictionary looms for coins!"
    },
    {
      id: "word-factory",
      name: "Word Factory",
      icon: "📦",
      category: "arcade",
      mechanic: "Conveyor Belt Sorter",
      difficulty: "Normal",
      desc: "Classify rolling assembly-line words into four collection bins: [Noun], [Verb], [Adjective], [Adverb]!"
    },
    {
      id: "grammar-galaxy",
      name: "Grammar Galaxy",
      icon: "🚀",
      category: "arcade",
      mechanic: "Asteroid Blaster",
      difficulty: "Normal",
      desc: "Tumbling space rocks carry flawed and correct phrases. Lock onto the grammatically correct asteroid and fire!"
    },
    {
      id: "vocab-fishing",
      name: "Vocabulary Fishing",
      icon: "🎣",
      category: "arcade",
      mechanic: "Hook & Reel Arcade",
      difficulty: "Normal",
      desc: "Drop your fishing hook into tropical waters to reel in the fish tagged with the matching synonym!"
    },
    {
      id: "sentence-builder",
      name: "Sentence Builder",
      icon: "✍️",
      category: "grammar",
      mechanic: "Cloze Narrative",
      difficulty: "Normal",
      desc: "Advance an epic quest by choosing missing prepositions, relative pronouns, and tense auxiliaries in context."
    },
    {
      id: "word-maze",
      name: "Word Maze",
      icon: "🌀",
      category: "strategy",
      mechanic: "Labyrinth Exploration",
      difficulty: "Hard",
      desc: "Navigate a 2D maze with arrow keys. Unlock iron gates by answering vocabulary gatekeeper riddles."
    },
    {
      id: "dictionary-dash",
      name: "Dictionary Dash",
      icon: "📖",
      category: "vocabulary",
      mechanic: "Oxford Time Attack",
      difficulty: "Hard",
      desc: "Read real dictionary definitions and identify the elusive headword before the clock strikes zero."
    },
    {
      id: "synonym-showdown",
      name: "Synonym Showdown",
      icon: "🪢",
      category: "arcade",
      mechanic: "Tug-of-War Battle",
      difficulty: "Normal",
      desc: "Select genuine synonyms to pull the giant rope toward your side before the rival squad drags you into the mud!"
    },
    {
      id: "antonym-attack",
      name: "Antonym Attack",
      icon: "🛡️",
      category: "arcade",
      mechanic: "Missile Interception",
      difficulty: "Normal",
      desc: "Incoming word missiles rain over the city. Launch defensive counter-missiles with polar opposite antonyms!"
    },
    {
      id: "reading-detective",
      name: "Reading Detective",
      icon: "🔍",
      category: "reading",
      mechanic: "Mystery Dossier",
      difficulty: "Expert",
      desc: "Analyze detective incident reports, review clues, and deduce the culprit through critical reading comprehension."
    },
    {
      id: "idiom-quest",
      name: "Idiom Quest",
      icon: "📜",
      category: "reading",
      mechanic: "Figurative Riddles",
      difficulty: "Normal",
      desc: "Decode colorful English idioms and discover the fascinating historical folklore behind their origins."
    },
    {
      id: "word-survivor",
      name: "Word Survivor",
      icon: "🛡️",
      category: "arcade",
      mechanic: "Wave Survival Arena",
      difficulty: "Hard",
      desc: "Survive escalating waves of linguistic challenges. Trigger blastwaves and freeze shields with correct answers!"
    },
    {
      id: "english-royale",
      name: "English Royale",
      icon: "👑",
      category: "strategy",
      mechanic: "10-Player Knockout",
      difficulty: "Expert",
      desc: "Compete against 9 contenders across 4 rapid knockout rounds. Avoid elimination to claim the Royale Crown!"
    },
    {
      id: "punctuation-patrol",
      name: "Punctuation Patrol",
      icon: "🚨",
      category: "grammar",
      mechanic: "Hazard Defusal",
      difficulty: "Easy",
      desc: "Identify comma splices, rogue apostrophes, and run-on sentences to safely disarm grammar hazards!"
    }
  ];

  // Random picker helper
  function getRandomQuestions(catFilter = null, count = 5) {
    let pool = window.LexiData.questions;
    if (catFilter && catFilter !== "all") {
      pool = pool.filter(q => q.category === catFilter);
      if (pool.length < count) pool = window.LexiData.questions;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Active Session State
  let session = {
    gameId: null,
    score: 0,
    streak: 0,
    timer: 60,
    timerInterval: null,
    currentQuestionIndex: 0,
    questions: [],
    correctCount: 0,
    totalCount: 0,
    customState: {},
    onFinishCallback: null
  };

  function cleanupSession() {
    if (session.timerInterval) {
      clearInterval(session.timerInterval);
      session.timerInterval = null;
    }
  }

  function startTimer(duration, onTick, onComplete) {
    cleanupSession();
    session.timer = duration;
    onTick(session.timer);
    session.timerInterval = setInterval(() => {
      session.timer--;
      onTick(session.timer);
      if (session.timer <= 0) {
        cleanupSession();
        onComplete();
      }
    }, 1000);
  }

  // Unified answer handler that updates score, streak, audio, and UI feedback
  function handleAnswerChoice(chosenIndex, correctIndex, buttonElements, onNext) {
    const isCorrect = chosenIndex === correctIndex;
    session.totalCount++;

    buttonElements.forEach((btn, idx) => {
      btn.style.pointerEvents = "none";
      if (idx === correctIndex) btn.classList.add("correct");
      else if (idx === chosenIndex) btn.classList.add("wrong");
    });

    if (isCorrect) {
      session.score += 100 + (session.streak * 20);
      session.streak++;
      session.correctCount++;
      window.LexiAudio.playCorrect();
    } else {
      session.streak = 0;
      window.LexiAudio.playWrong();
    }

    setTimeout(() => {
      onNext(isCorrect);
    }, 900);
  }

  // Render Generic Question Box
  function renderStandardQuestionBox(q, onAnswer) {
    const letters = ["A", "B", "C", "D"];
    return `
      <div class="question-prompt-box">
        <span class="question-prompt-category">${q.category.toUpperCase()} • ${q.difficulty.toUpperCase()}</span>
        <div class="question-prompt-text">${q.question}</div>
      </div>
      <div class="options-grid" id="arena-options-grid">
        ${q.options.map((opt, i) => `
          <button class="option-btn" data-index="${i}">
            <span class="option-key">${letters[i]}</span>
            <span>${opt}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  // =========================================================================
  // IMPLEMENTATIONS FOR ALL 21 GAME MODES
  // =========================================================================

  const runners = {
    // 1. Vocabulary Race
    "vocab-race": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 6);
      session.customState = { playerPos: 0, rivalPos: 0 };

      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div class="race-track-container">
            <div class="race-lane">
              <span class="race-lane-label">Player Racer</span>
              <div class="race-car" id="race-player-car" style="left: ${session.customState.playerPos}%;">🏎️</div>
            </div>
            <div class="race-lane">
              <span class="race-lane-label">Rival AI</span>
              <div class="race-car" id="race-rival-car" style="left: ${session.customState.rivalPos}%;">🏁</div>
            </div>
          </div>
          ${renderStandardQuestionBox(q)}
        `;

        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, (correct) => {
              if (correct) session.customState.playerPos = Math.min(90, session.customState.playerPos + 18);
              session.customState.rivalPos = Math.min(90, session.customState.rivalPos + 14);
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }

      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 2. Grammar Battle (RPG Turn-Based)
    "grammar-battle": function (container, onFinish) {
      session.questions = getRandomQuestions("grammar", 6);
      session.customState = { playerHp: 100, bossHp: 100, bossName: "Syntax Dragon" };

      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length || session.customState.bossHp <= 0 || session.customState.playerHp <= 0) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div class="rpg-battle-stage">
            <div class="rpg-fighter">
              <div class="rpg-avatar" id="battle-player-avatar">🧙‍♂️</div>
              <div style="font-weight: 800; font-size: 0.9rem;">Scholar Mage</div>
              <div class="hp-bar-outer">
                <div class="hp-bar-fill" style="width: ${session.customState.playerHp}%;"></div>
              </div>
            </div>
            <div style="font-size: 2rem; font-weight: 900; color: #ef4444;">VS</div>
            <div class="rpg-fighter">
              <div class="rpg-avatar" id="battle-boss-avatar">🐲</div>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f87171;">${session.customState.bossName}</div>
              <div class="hp-bar-outer">
                <div class="hp-bar-fill boss" style="width: ${session.customState.bossHp}%;"></div>
              </div>
            </div>
          </div>
          ${renderStandardQuestionBox(q)}
        `;

        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, (correct) => {
              if (correct) {
                session.customState.bossHp = Math.max(0, session.customState.bossHp - 25);
              } else {
                session.customState.playerHp = Math.max(0, session.customState.playerHp - 20);
              }
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }

      startTimer(60, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 3. Word Tower (Stacking Physics)
    "word-tower": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 8);
      session.customState = { floors: [] };

      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div class="tower-stage" id="tower-stage-container">
            ${session.customState.floors.map(f => `
              <div class="tower-block" style="width: ${f.width}px; background: ${f.color};">
                Floor ${f.level}
              </div>
            `).join("")}
          </div>
          ${renderStandardQuestionBox(q)}
        `;

        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, (correct) => {
              if (correct) {
                session.customState.floors.push({
                  level: session.customState.floors.length + 1,
                  width: Math.max(120, 220 - session.customState.floors.length * 12),
                  color: "#6366f1"
                });
              }
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }

      startTimer(50, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 4. Sentence Scramble
    "sentence-scramble": function (container, onFinish) {
      const sentences = [
        { original: "The diligent scholar solved the complex riddle easily", words: ["The", "diligent", "scholar", "solved", "the", "complex", "riddle", "easily"] },
        { original: "Curiosity and patience lead to great academic achievements", words: ["Curiosity", "and", "patience", "lead", "to", "great", "academic", "achievements"] },
        { original: "She reads eloquent poetry under the quiet moonlight", words: ["She", "reads", "eloquent", "poetry", "under", "the", "quiet", "moonlight"] }
      ];
      session.customState = { sentenceIndex: 0, currentAttempt: [] };

      function renderStep() {
        if (session.customState.sentenceIndex >= sentences.length) {
          finishGame();
          return;
        }
        const s = sentences[session.customState.sentenceIndex];
        const remainingWords = s.words.filter((w, idx) => !session.customState.currentAttempt.includes(idx));

        container.innerHTML = `
          <div class="question-prompt-box">
            <span class="question-prompt-category">SENTENCE SCRAMBLE • CLICK WORDS IN SYNTACTIC ORDER</span>
            <div class="question-prompt-text">Assemble the sentence:</div>
          </div>
          <div class="scramble-slots">
            ${session.customState.currentAttempt.map(idx => `<span class="word-tile" style="background: var(--primary); color: #fff;">${s.words[idx]}</span>`).join("")}
            ${session.customState.currentAttempt.length === 0 ? '<span style="color: var(--text-dim); font-size: 0.9rem;">Click word tiles below...</span>' : ''}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; max-width: 750px; margin-bottom: 1.5rem;">
            ${s.words.map((w, idx) => {
              const used = session.customState.currentAttempt.includes(idx);
              return `<button class="word-tile" data-word-idx="${idx}" ${used ? 'style="opacity: 0.3; pointer-events: none;"' : ''}>${w}</button>`;
            }).join("")}
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-scramble-reset">↺ Reset Order</button>
        `;

        container.querySelectorAll(".word-tile[data-word-idx]").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.wordIdx, 10);
            session.customState.currentAttempt.push(idx);
            window.LexiAudio.playClick();
            if (session.customState.currentAttempt.length === s.words.length) {
              const reconstructed = session.customState.currentAttempt.map(i => s.words[i]).join(" ");
              if (reconstructed === s.original) {
                session.score += 250;
                session.correctCount++;
                window.LexiAudio.playCorrect();
              } else {
                window.LexiAudio.playWrong();
              }
              session.totalCount++;
              setTimeout(() => {
                session.customState.sentenceIndex++;
                session.customState.currentAttempt = [];
                renderStep();
              }, 800);
            } else {
              renderStep();
            }
          });
        });

        const resetBtn = container.querySelector("#btn-scramble-reset");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            session.customState.currentAttempt = [];
            renderStep();
          });
        }
      }

      startTimer(60, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 5. Spelling Sprint
    "spelling-sprint": function (container, onFinish) {
      session.questions = getRandomQuestions("spelling", 8);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem; animation: pulse 0.5s infinite alternate;">⚡</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(35, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 6. Treasure Words (Memory Matching Pairs)
    "treasure-words": function (container, onFinish) {
      const pairs = [
        { word: "Abundant", matchId: 1 }, { word: "Plentiful", matchId: 1 },
        { word: "Perilous", matchId: 2 }, { word: "Dangerous", matchId: 2 },
        { word: "Lucid", matchId: 3 }, { word: "Clear", matchId: 3 },
        { word: "Frugal", matchId: 4 }, { word: "Thrifty", matchId: 4 }
      ];
      const cards = pairs.sort(() => Math.random() - 0.5);
      session.customState = { flipped: [], matched: [] };

      function renderStep() {
        if (session.customState.matched.length === pairs.length) {
          session.score += 300;
          session.correctCount += 4;
          finishGame();
          return;
        }
        container.innerHTML = `
          <div class="question-prompt-box">
            <span class="question-prompt-category">TREASURE WORDS • MEMORY MATCHING DUNGEON</span>
            <div class="question-prompt-text">Flip stones to pair matching synonyms!</div>
          </div>
          <div class="memory-grid">
            ${cards.map((c, i) => {
              const isFlipped = session.customState.flipped.includes(i) || session.customState.matched.includes(i);
              const isMatched = session.customState.matched.includes(i);
              return `
                <div class="memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}" data-card-idx="${i}">
                  ${isFlipped ? c.word : '❓'}
                </div>
              `;
            }).join("")}
          </div>
        `;

        container.querySelectorAll(".memory-card").forEach(card => {
          card.addEventListener("click", () => {
            const idx = parseInt(card.dataset.cardIdx, 10);
            if (session.customState.flipped.includes(idx) || session.customState.matched.includes(idx)) return;
            if (session.customState.flipped.length >= 2) return;

            window.LexiAudio.playClick();
            session.customState.flipped.push(idx);
            renderStep();

            if (session.customState.flipped.length === 2) {
              const [first, second] = session.customState.flipped;
              if (cards[first].matchId === cards[second].matchId) {
                session.customState.matched.push(first, second);
                session.customState.flipped = [];
                session.score += 150;
                window.LexiAudio.playCorrect();
                setTimeout(renderStep, 500);
              } else {
                window.LexiAudio.playWrong();
                setTimeout(() => {
                  session.customState.flipped = [];
                  renderStep();
                }, 900);
              }
            }
          });
        });
      }

      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 7. Word Duel (Western Reaction)
    "word-duel": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 4);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🤠 vs 🦹</div>
          <div class="hero-badge" style="background: #ef4444; color: #fff; font-size: 1rem; padding: 0.4rem 1.2rem; animation: pulse 0.6s infinite;">
            DRAW! QUICK-PICK DEFINITION
          </div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(30, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 8. English Tycoon
    "english-tycoon": function (container, onFinish) {
      session.questions = getRandomQuestions("grammar", 10);
      session.customState = { ink: 0, presses: 1 };

      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div class="tycoon-dashboard">
            <div class="tycoon-machine">
              <div class="tycoon-machine-header">
                <span>🖋️ Ink Reserves</span>
                <span style="color: var(--accent-gold);">${session.customState.ink} L</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Answer questions to produce ink!</div>
            </div>
            <div class="tycoon-machine">
              <div class="tycoon-machine-header">
                <span>🏭 Printing Presses</span>
                <span style="color: #34d399;">x${session.customState.presses}</span>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-buy-press" ${session.customState.ink >= 100 ? '' : 'disabled'}>
                Upgrade (100 Ink)
              </button>
            </div>
          </div>
          ${renderStandardQuestionBox(q)}
        `;

        const buyBtn = container.querySelector("#btn-buy-press");
        if (buyBtn) {
          buyBtn.addEventListener("click", () => {
            if (session.customState.ink >= 100) {
              session.customState.ink -= 100;
              session.customState.presses++;
              session.score += 200;
              window.LexiAudio.playCorrect();
              renderStep();
            }
          });
        }

        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, (correct) => {
              if (correct) {
                session.customState.ink += 50 * session.customState.presses;
              }
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }

      startTimer(60, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 9. Word Factory (Conveyor Belt Sorter)
    "word-factory": function (container, onFinish) {
      const words = [
        { word: "Elephant", type: "Noun" },
        { word: "Leap", type: "Verb" },
        { word: "Luminous", type: "Adjective" },
        { word: "Swiftly", type: "Adverb" },
        { word: "Castle", type: "Noun" },
        { word: "Contemplate", type: "Verb" }
      ];
      session.customState = { wordIndex: 0 };

      function renderStep() {
        if (session.customState.wordIndex >= words.length) {
          finishGame();
          return;
        }
        const current = words[session.customState.wordIndex];
        container.innerHTML = `
          <div class="conveyor-belt">
            <div class="conveyor-item">${current.word}</div>
          </div>
          <div class="question-prompt-box">
            <div class="question-prompt-text">Sort incoming item into its grammatical part of speech:</div>
          </div>
          <div class="options-grid">
            <button class="option-btn" data-type="Noun"><span class="option-key">N</span> Noun</button>
            <button class="option-btn" data-type="Verb"><span class="option-key">V</span> Verb</button>
            <button class="option-btn" data-type="Adjective"><span class="option-key">A</span> Adjective</button>
            <button class="option-btn" data-type="Adverb"><span class="option-key">D</span> Adverb</button>
          </div>
        `;

        container.querySelectorAll(".option-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const chosen = btn.dataset.type;
            const isCorrect = chosen === current.type;
            session.totalCount++;
            if (isCorrect) {
              session.score += 150;
              session.correctCount++;
              session.streak++;
              btn.classList.add("correct");
              window.LexiAudio.playCorrect();
            } else {
              session.streak = 0;
              btn.classList.add("wrong");
              window.LexiAudio.playWrong();
            }
            setTimeout(() => {
              session.customState.wordIndex++;
              renderStep();
            }, 600);
          });
        });
      }

      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 10. Grammar Galaxy
    "grammar-galaxy": function (container, onFinish) {
      session.questions = getRandomQuestions("grammar", 5);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌌 🚀 ☄️</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(50, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 11. Vocabulary Fishing
    "vocab-fishing": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 5);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">⛵ 🎣 🐟</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 12. Sentence Builder
    "sentence-builder": function (container, onFinish) {
      session.questions = getRandomQuestions("grammar", 5);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📖 ✍️ ✨</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(50, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 13. Word Maze
    "word-maze": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 5);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌀 🗝️ 🚪</div>
          <div class="hero-badge">GATE ${session.currentQuestionIndex + 1} OF 5 LOCKED</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(50, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 14. Dictionary Dash
    "dictionary-dash": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 6);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📖 ⏱️</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(40, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 15. Synonym Showdown
    "synonym-showdown": function (container, onFinish) {
      session.questions = getRandomQuestions("synonyms", 5);
      session.customState = { pullPos: 0 };
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 2.8rem; margin-bottom: 0.5rem; text-align: center;">
            🤼 ━━━━━🚩━━━━━ 🤼
          </div>
          <div class="progress-bar-wrap" style="height: 14px; max-width: 500px; margin: 0 auto 1.5rem;">
            <div class="progress-bar-fill" style="width: ${50 + session.customState.pullPos}%; background: #34d399;"></div>
          </div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, (correct) => {
              if (correct) session.customState.pullPos = Math.min(45, session.customState.pullPos + 18);
              else session.customState.pullPos = Math.max(-45, session.customState.pullPos - 15);
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 16. Antonym Attack
    "antonym-attack": function (container, onFinish) {
      session.questions = getRandomQuestions("antonyms", 5);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚀 💥 🏙️</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 17. Reading Detective
    "reading-detective": function (container, onFinish) {
      session.questions = getRandomQuestions("reading", 4);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🔍 🕵️‍♂️ 📁</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(60, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 18. Idiom Quest
    "idiom-quest": function (container, onFinish) {
      session.questions = getRandomQuestions("idioms", 5);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📜 🔮 ✨</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 19. Word Survivor
    "word-survivor": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 6);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🛡️ 👾 ⚔️</div>
          <div class="hero-badge">SURVIVAL WAVE ${session.currentQuestionIndex + 1} OF 6</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(40, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 20. English Royale (10-Player Knockout)
    "english-royale": function (container, onFinish) {
      session.questions = getRandomQuestions("vocabulary", 5);
      session.customState = { aliveCount: 10, round: 1 };

      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="display: flex; gap: 1rem; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <span style="font-size: 2.2rem;">👑</span>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--accent-gold);">
              CONTENDERS REMAINING: ${session.customState.aliveCount} / 10
            </div>
          </div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.customState.aliveCount = Math.max(1, session.customState.aliveCount - 2);
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    },

    // 21. Punctuation Patrol
    "punctuation-patrol": function (container, onFinish) {
      session.questions = getRandomQuestions("punctuation", 5);
      function renderStep() {
        if (session.currentQuestionIndex >= session.questions.length) {
          finishGame();
          return;
        }
        const q = session.questions[session.currentQuestionIndex];
        container.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚨 🚦 🛡️</div>
          ${renderStandardQuestionBox(q)}
        `;
        const buttons = container.querySelectorAll(".option-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            handleAnswerChoice(idx, q.correct, buttons, () => {
              session.currentQuestionIndex++;
              renderStep();
            });
          });
        });
      }
      startTimer(45, (t) => updateLiveStats(t), () => finishGame());
      renderStep();
    }
  };

  function updateLiveStats(timeLeft) {
    const timerElem = document.getElementById("arena-live-timer");
    const scoreElem = document.getElementById("arena-live-score");
    const streakElem = document.getElementById("arena-live-streak");
    if (timerElem) timerElem.textContent = `${timeLeft}s`;
    if (scoreElem) scoreElem.textContent = session.score;
    if (streakElem) streakElem.textContent = session.streak;
  }

  function finishGame() {
    cleanupSession();
    const won = session.score > 200 || (session.correctCount >= Math.ceil(session.totalCount * 0.6));
    const accuracy = session.totalCount > 0 ? Math.round((session.correctCount / session.totalCount) * 100) : 100;
    const earnedCoins = Math.round(session.score / 5) + (won ? 50 : 15);
    const earnedXp = session.score + (won ? 150 : 50);

    if (won) window.LexiAudio.playVictory();
    else window.LexiAudio.playLevelUp();

    const stage = document.getElementById("arena-main-stage");
    if (stage) {
      stage.innerHTML = `
        <div class="game-results-card">
          <div class="results-badge-icon">${won ? '🏆' : '⭐'}</div>
          <h2 class="results-title">${won ? 'Victory Achieved!' : 'Match Completed!'}</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            ${won ? 'Outstanding linguistic performance!' : 'Great effort! Practice makes permanent.'}
          </p>

          <div class="results-stats-row">
            <div class="results-stat-item">
              <h4>FINAL SCORE</h4>
              <div class="res-val">${session.score}</div>
            </div>
            <div class="results-stat-item">
              <h4>ACCURACY</h4>
              <div class="res-val" style="color: #34d399;">${accuracy}%</div>
            </div>
            <div class="results-stat-item">
              <h4>COINS EARNED</h4>
              <div class="res-val">🪙 +${earnedCoins}</div>
            </div>
            <div class="results-stat-item">
              <h4>XP GAINED</h4>
              <div class="res-val" style="color: #818cf8;">⭐ +${earnedXp}</div>
            </div>
          </div>

          <div class="results-buttons">
            <button class="btn btn-primary" id="btn-results-replay">
              ↺ Play Again
            </button>
            <button class="btn btn-secondary" id="btn-results-library">
              Back to Games
            </button>
          </div>
        </div>
      `;

      stage.querySelector("#btn-results-replay").addEventListener("click", () => {
        launchGame(session.gameId, session.onFinishCallback);
      });
      stage.querySelector("#btn-results-library").addEventListener("click", () => {
        if (window.LexiApp) window.LexiApp.switchView("games");
      });
    }

    if (session.onFinishCallback) {
      session.onFinishCallback({
        gameId: session.gameId,
        score: session.score,
        won,
        correct: session.correctCount,
        incorrect: session.totalCount - session.correctCount,
        accuracy,
        earnedCoins,
        earnedXp
      });
    }
  }

  function launchGame(gameId, onFinish) {
    const runner = runners[gameId] || runners["vocab-race"];
    const gameMeta = gamesList.find(g => g.id === gameId) || gamesList[0];

    session = {
      gameId,
      score: 0,
      streak: 0,
      timer: 60,
      timerInterval: null,
      currentQuestionIndex: 0,
      questions: [],
      correctCount: 0,
      totalCount: 0,
      customState: {},
      onFinishCallback: onFinish
    };

    // Update Header Bar
    const iconElem = document.getElementById("arena-current-icon");
    const nameElem = document.getElementById("arena-current-name");
    if (iconElem) iconElem.textContent = gameMeta.icon;
    if (nameElem) nameElem.textContent = gameMeta.name;
    updateLiveStats(60);

    const stage = document.getElementById("arena-main-stage");
    if (stage) {
      stage.innerHTML = `<div style="font-size: 2rem; color: var(--text-muted);">Preparing stage...</div>`;
      runner(stage, finishGame);
    }
  }

  return {
    list: gamesList,
    launch: launchGame,
    cleanup: cleanupSession
  };
})();
