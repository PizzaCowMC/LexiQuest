/* ==========================================================================
   LexiQuest: English Arcade - Engine Module (js/engine.js)
   - Web Audio API Sound Synthesizer & Procedural BGM
   - Web Crypto SHA-256 Browser Account & Auth System
   - Persistent Local Storage & Save Import/Export
   - Community System (Local Posts, Comments, Likes)
   - Party Multiplayer (BroadcastChannel Inter-Tab Synchronization)
   ========================================================================== */

// 1. WEB AUDIO API SYNTHESIZER & AMBIENT MUSIC
window.LexiAudio = (function () {
  let audioCtx = null;
  let sfxEnabled = true;
  let musicEnabled = false;
  let musicTimer = null;

  function initContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = "sine", duration = 0.15, gainVal = 0.1) {
    if (!sfxEnabled) return;
    try {
      initContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playClick() {
    playTone(600, "triangle", 0.06, 0.08);
  }

  function playCorrect() {
    if (!sfxEnabled) return;
    initContext();
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, "sine", 0.18, 0.12), idx * 60);
    });
  }

  function playWrong() {
    if (!sfxEnabled) return;
    initContext();
    if (!audioCtx) return;
    playTone(280, "sawtooth", 0.18, 0.1);
    setTimeout(() => playTone(220, "sawtooth", 0.25, 0.1), 120);
  }

  function playLevelUp() {
    if (!sfxEnabled) return;
    initContext();
    if (!audioCtx) return;
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    arpeggio.forEach((freq, i) => {
      setTimeout(() => playTone(freq, "triangle", 0.22, 0.12), i * 70);
    });
  }

  function playAchievement() {
    if (!sfxEnabled) return;
    initContext();
    if (!audioCtx) return;
    const notes = [587.33, 739.99, 880, 1174.66];
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, "sine", 0.28, 0.12), i * 80);
    });
  }

  function playVictory() {
    if (!sfxEnabled) return;
    initContext();
    if (!audioCtx) return;
    const chords = [
      [523.25, 659.25, 783.99],
      [587.33, 739.99, 880],
      [659.25, 830.61, 987.77],
      [783.99, 987.77, 1174.66]
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(f => playTone(f, "triangle", 0.35, 0.08));
      }, i * 200);
    });
  }

  // Procedural Ambient Synthesizer Music
  function startProceduralBGM() {
    if (!musicEnabled || musicTimer) return;
    initContext();
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C major pentatonic
    let step = 0;
    musicTimer = setInterval(() => {
      if (!musicEnabled) {
        clearInterval(musicTimer);
        musicTimer = null;
        return;
      }
      const freq = scale[step % scale.length];
      playTone(freq, "sine", 0.6, 0.03);
      step = (step + Math.floor(Math.random() * 3) + 1);
    }, 450);
  }

  function stopProceduralBGM() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  return {
    init: initContext,
    playClick,
    playCorrect,
    playWrong,
    playLevelUp,
    playAchievement,
    playVictory,
    setSfx: (val) => { sfxEnabled = !!val; },
    setMusic: (val) => {
      musicEnabled = !!val;
      if (musicEnabled) startProceduralBGM();
      else stopProceduralBGM();
    },
    isSfx: () => sfxEnabled,
    isMusic: () => musicEnabled
  };
})();

// 2. STORAGE & WEB CRYPTO AUTHENTICATION SYSTEM
window.LexiAuth = (function () {
  const STORAGE_KEY_ACCOUNTS = "lexiquest_accounts_v1";
  const STORAGE_KEY_SESSION = "lexiquest_session_v1";

  // SHA-256 Password Hash using Native Web Crypto API
  async function hashPassword(password, salt = "lexi_salt_2026") {
    const encoder = new TextEncoder();
    const data = encoder.encode(salt + password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function getStoredAccounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  }

  // Create or retrieve default starter profile
  function initDefaultUser() {
    const accounts = getStoredAccounts();
    const defaultUsername = "WordExplorer";
    if (!accounts[defaultUsername]) {
      accounts[defaultUsername] = {
        username: defaultUsername,
        passwordHash: "demo_guest_hash",
        level: 1,
        xp: 0,
        coins: 150,
        equippedCharacterId: "char-1",
        ownedCharacters: ["char-1"],
        favoriteCharacters: ["char-1"],
        gamesPlayed: 0,
        gamesWon: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        unlockedAchievements: [],
        lastDailyReward: 0,
        gameStats: {},
        createdAt: Date.now()
      };
      saveAccounts(accounts);
    }
    const currentSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!currentSession || !accounts[currentSession]) {
      localStorage.setItem(STORAGE_KEY_SESSION, defaultUsername);
    }
    return accounts[localStorage.getItem(STORAGE_KEY_SESSION)];
  }

  async function signUp(username, password) {
    const cleanUser = username.trim();
    if (!cleanUser || cleanUser.length < 3) {
      throw new Error("Username must be at least 3 characters long.");
    }
    if (!password || password.length < 4) {
      throw new Error("Password must be at least 4 characters long.");
    }
    const accounts = getStoredAccounts();
    if (accounts[cleanUser]) {
      throw new Error("This username already exists. Please pick another.");
    }

    const hash = await hashPassword(password);
    accounts[cleanUser] = {
      username: cleanUser,
      passwordHash: hash,
      level: 1,
      xp: 0,
      coins: 200,
      equippedCharacterId: "char-1",
      ownedCharacters: ["char-1"],
      favoriteCharacters: ["char-1"],
      gamesPlayed: 0,
      gamesWon: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      unlockedAchievements: [],
      lastDailyReward: 0,
      gameStats: {},
      createdAt: Date.now()
    };
    saveAccounts(accounts);
    localStorage.setItem(STORAGE_KEY_SESSION, cleanUser);
    return accounts[cleanUser];
  }

  async function logIn(username, password) {
    const cleanUser = username.trim();
    const accounts = getStoredAccounts();
    const user = accounts[cleanUser];
    if (!user) {
      throw new Error("Account not found. Please check your username or sign up.");
    }
    const hash = await hashPassword(password);
    if (user.passwordHash !== hash) {
      throw new Error("Incorrect password. Please try again.");
    }
    localStorage.setItem(STORAGE_KEY_SESSION, cleanUser);
    return user;
  }

  function logOut() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    return initDefaultUser();
  }

  function getCurrentUser() {
    const accounts = getStoredAccounts();
    const session = localStorage.getItem(STORAGE_KEY_SESSION);
    if (session && accounts[session]) {
      return accounts[session];
    }
    return initDefaultUser();
  }

  function updateUser(userData) {
    const accounts = getStoredAccounts();
    if (userData && userData.username) {
      accounts[userData.username] = userData;
      saveAccounts(accounts);
    }
  }

  return {
    init: initDefaultUser,
    signUp,
    logIn,
    logOut,
    getCurrentUser,
    updateUser,
    getAllAccounts: getStoredAccounts
  };
})();

// 3. COMMUNITY HUB SYSTEM (PERSISTENT LOCAL POSTS, COMMENTS, LIKES)
window.LexiCommunity = (function () {
  const STORAGE_KEY_POSTS = "lexiquest_community_posts_v1";

  const seedPosts = [
    {
      id: "post-1",
      author: "Professor Owl",
      authorIcon: "🦉",
      title: "How to master tricky irregular verb forms in 5 minutes!",
      content: "Always group irregular verbs by sound patterns! For example: sing/sang/sung, ring/rang/rung, spring/sprang/sprung. Once your brain recognizes the rhythm, you'll never hesitate again!",
      tag: "#GrammarTips",
      likes: 18,
      likedBy: [],
      comments: [
        { author: "Cyber Fox", icon: "🦊", text: "Brilliant tip! It really helped in the Grammar Battle mode!", date: "2 hours ago" },
        { author: "Solar Knight", icon: "⚔️", text: "Grouping blow/blew/blown with fly/flew/flown works wonders too!", date: "1 hour ago" }
      ],
      createdAt: Date.now() - 3600000 * 24
    },
    {
      id: "post-2",
      author: "Ninja Cat",
      authorIcon: "🥷",
      title: "Just scored 4,200 points in English Royale!",
      content: "Speed is everything in the final showdown! Make sure you read the question prompt first before looking at the 4 answers so you don't get distracted by close lookalikes.",
      tag: "#HighScores",
      likes: 24,
      likedBy: [],
      comments: [
        { author: "Pixel Panda", icon: "🐼", text: "GG! Who is your equipped mascot?", date: "3 hours ago" }
      ],
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: "post-3",
      author: "Space Penguin",
      authorIcon: "🐧",
      title: "Why is 'affect' vs 'effect' so tricky?",
      content: "Remember this simple acronym: RAVEN! R = Remember, A = Affect is a Verb, E = Effect is a Noun. That one rule saves you on 95% of test questions!",
      tag: "#StudyAdvice",
      likes: 35,
      likedBy: [],
      comments: [],
      createdAt: Date.now() - 3600000 * 5
    }
  ];

  function getPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_POSTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(seedPosts));
    return seedPosts;
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }

  function createPost(title, content, tag, user) {
    const posts = getPosts();
    const newPost = {
      id: "post-" + Date.now(),
      author: user.username,
      authorIcon: (user.equippedCharacter && user.equippedCharacter.icon) || "🦊",
      title: title.trim(),
      content: content.trim(),
      tag: tag || "#General",
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: Date.now()
    };
    posts.unshift(newPost);
    savePosts(posts);
    return newPost;
  }

  function toggleLike(postId, username) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    if (!Array.isArray(post.likedBy)) post.likedBy = [];
    const idx = post.likedBy.indexOf(username);
    if (idx >= 0) {
      post.likedBy.splice(idx, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(username);
      post.likes += 1;
    }
    savePosts(posts);
    return post;
  }

  function addComment(postId, text, user) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !text.trim()) return;
    if (!Array.isArray(post.comments)) post.comments = [];
    const comment = {
      author: user.username,
      icon: (user.equippedCharacter && user.equippedCharacter.icon) || "🦊",
      text: text.trim(),
      date: "Just now"
    };
    post.comments.push(comment);
    savePosts(posts);
    return post;
  }

  function deletePost(postId, username) {
    let posts = getPosts();
    posts = posts.filter(p => p.id !== postId || p.author !== username);
    savePosts(posts);
    return posts;
  }

  return {
    getPosts,
    createPost,
    toggleLike,
    addComment,
    deletePost
  };
})();

// 4. PARTY MULTIPLAYER SYSTEM (BROADCASTCHANNEL INTER-TAB SYNCHRONIZATION)
window.LexiParty = (function () {
  let channel = null;
  let currentRoom = null;
  let onPartyUpdateCallback = null;

  try {
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel("lexiquest_party_channel");
      channel.onmessage = (event) => {
        handleIncomingMessage(event.data);
      };
    }
  } catch (e) {
    console.warn("BroadcastChannel not available in this environment.");
  }

  function handleIncomingMessage(msg) {
    if (!msg || !currentRoom) return;
    if (msg.roomCode !== currentRoom.code) return;

    switch (msg.type) {
      case "PLAYER_JOIN":
        if (!currentRoom.players.some(p => p.name === msg.player.name)) {
          currentRoom.players.push(msg.player);
          notify();
          // Host replies with full state
          if (currentRoom.isHost && channel) {
            channel.postMessage({
              type: "ROOM_STATE_SYNC",
              roomCode: currentRoom.code,
              room: currentRoom
            });
          }
        }
        break;

      case "ROOM_STATE_SYNC":
        if (!currentRoom.isHost) {
          currentRoom.players = msg.room.players;
          currentRoom.selectedGame = msg.room.selectedGame;
          notify();
        }
        break;

      case "GAME_STARTED":
        if (onPartyUpdateCallback) {
          onPartyUpdateCallback({ type: "START_GAME", gameId: msg.gameId });
        }
        break;

      case "SCORE_UPDATE":
        const player = currentRoom.players.find(p => p.name === msg.playerName);
        if (player) {
          player.score = msg.score;
          notify();
        }
        break;

      case "PLAYER_LEFT":
        currentRoom.players = currentRoom.players.filter(p => p.name !== msg.playerName);
        notify();
        break;
    }
  }

  function notify() {
    if (onPartyUpdateCallback) {
      onPartyUpdateCallback({ type: "UPDATE_ROOM", room: currentRoom });
    }
  }

  function createRoom(user) {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    currentRoom = {
      code: roomCode,
      isHost: true,
      selectedGame: "vocab-race",
      players: [
        {
          name: user.username,
          avatar: (user.equippedCharacter && user.equippedCharacter.icon) || "🦊",
          score: 0,
          isHost: true
        }
      ]
    };
    return currentRoom;
  }

  function joinRoom(roomCode, user) {
    currentRoom = {
      code: roomCode,
      isHost: false,
      selectedGame: "vocab-race",
      players: [
        {
          name: user.username,
          avatar: (user.equippedCharacter && user.equippedCharacter.icon) || "🦊",
          score: 0,
          isHost: false
        }
      ]
    };

    if (channel) {
      channel.postMessage({
        type: "PLAYER_JOIN",
        roomCode: roomCode,
        player: currentRoom.players[0]
      });
    }
    return currentRoom;
  }

  function addBotPlayer() {
    if (!currentRoom) return;
    const botNames = [
      { name: "Pixel Bot", icon: "🤖" },
      { name: "Grammar Queen", icon: "👑" },
      { name: "Speedy Tiger", icon: "🐯" },
      { name: "Dr. Vocab", icon: "🦉" },
      { name: "Neon Shark", icon: "🦈" }
    ];
    const available = botNames.filter(b => !currentRoom.players.some(p => p.name === b.name));
    if (available.length === 0) return;
    const bot = available[0];
    currentRoom.players.push({
      name: bot.name,
      avatar: bot.icon,
      score: 0,
      isHost: false,
      isBot: true
    });
    notify();
  }

  function setGame(gameId) {
    if (!currentRoom || !currentRoom.isHost) return;
    currentRoom.selectedGame = gameId;
    if (channel) {
      channel.postMessage({
        type: "ROOM_STATE_SYNC",
        roomCode: currentRoom.code,
        room: currentRoom
      });
    }
    notify();
  }

  function startGame() {
    if (!currentRoom || !currentRoom.isHost) return;
    if (channel) {
      channel.postMessage({
        type: "GAME_STARTED",
        roomCode: currentRoom.code,
        gameId: currentRoom.selectedGame
      });
    }
    if (onPartyUpdateCallback) {
      onPartyUpdateCallback({ type: "START_GAME", gameId: currentRoom.selectedGame });
    }
  }

  function leaveRoom(user) {
    if (currentRoom && channel) {
      channel.postMessage({
        type: "PLAYER_LEFT",
        roomCode: currentRoom.code,
        playerName: user.username
      });
    }
    currentRoom = null;
    notify();
  }

  return {
    createRoom,
    joinRoom,
    addBotPlayer,
    setGame,
    startGame,
    leaveRoom,
    onUpdate: (cb) => { onPartyUpdateCallback = cb; },
    getRoom: () => currentRoom
  };
})();
