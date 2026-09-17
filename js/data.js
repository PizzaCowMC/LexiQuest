/* ==========================================================================
   LexiQuest: English Arcade - Data Module (js/data.js)
   - Extensive English Question Bank (Grammar, Vocab, Spelling, Idioms, etc.)
   - Procedural Generator for 520+ Unique Collectible Characters
   - 32 Comprehensive Achievements
   ========================================================================== */

window.LexiData = (function () {
  // 1. EXTENSIVE ENGLISH QUESTION BANK
  const questions = [
    // --- Vocabulary & Definitions ---
    {
      id: "v1", category: "vocabulary", difficulty: "easy",
      question: "What does the word 'candid' mean?",
      options: ["Secretive and quiet", "Truthful and straightforward", "Extremely angry", "Easily broken"],
      correct: 1, explanation: "'Candid' means truthful, frank, and straightforward."
    },
    {
      id: "v2", category: "vocabulary", difficulty: "normal",
      question: "Which word means 'lasting for a very short time'?",
      options: ["Permanent", "Ephemeral", "Perpetual", "Tedious"],
      correct: 1, explanation: "'Ephemeral' describes things that last only for a brief period."
    },
    {
      id: "v3", category: "vocabulary", difficulty: "normal",
      question: "What is the meaning of 'ubiquitous'?",
      options: ["Rare and precious", "Present or found everywhere", "Harmful to health", "Ancient and forgotten"],
      correct: 1, explanation: "'Ubiquitous' means existing or being present everywhere simultaneously."
    },
    {
      id: "v4", category: "vocabulary", difficulty: "hard",
      question: "Choose the best definition for 'meticulous':",
      options: ["Showing great attention to detail", "Careless and hurried", "Loud and disruptive", "Easily influenced"],
      correct: 0, explanation: "'Meticulous' means taking extreme care about tiny details; precise."
    },
    {
      id: "v5", category: "vocabulary", difficulty: "hard",
      question: "What is the meaning of 'serendipity'?",
      options: ["A planned experiment", "Finding valuable things by good fortune", "A state of deep grief", "A legal contract"],
      correct: 1, explanation: "'Serendipity' is the occurrence of events by chance in a happy or beneficial way."
    },
    {
      id: "v6", category: "vocabulary", difficulty: "expert",
      question: "A person described as 'tenacious' is someone who:",
      options: ["Gives up easily", "Holds firmly to a goal or belief", "Speaks with hesitation", "Avoids social contact"],
      correct: 1, explanation: "'Tenacious' means persistent, resolute, and not easily discouraged."
    },
    {
      id: "v7", category: "vocabulary", difficulty: "normal",
      question: "What does 'benevolent' mean?",
      options: ["Cruel and spiteful", "Well-meaning and kindly", "Greedy for power", "Frail and timid"],
      correct: 1, explanation: "'Benevolent' comes from Latin roots meaning wishing well; charitable."
    },
    {
      id: "v8", category: "vocabulary", difficulty: "easy",
      question: "Which word means 'new or inexperienced at an activity'?",
      options: ["Novice", "Veteran", "Expert", "Mentor"],
      correct: 0, explanation: "A 'novice' is someone who is new to and inexperienced in a job or situation."
    },

    // --- Grammar & Verb Tenses ---
    {
      id: "g1", category: "grammar", difficulty: "easy",
      question: "Choose the correct verb: 'Neither the teacher nor the students ____ in the room.'",
      options: ["is", "were", "was", "be"],
      correct: 1, explanation: "With 'neither... nor', the verb agrees with the closer subject ('students' -> were)."
    },
    {
      id: "g2", category: "grammar", difficulty: "normal",
      question: "Identify the sentence written in the passive voice:",
      options: ["The chef prepared a feast.", "A feast was prepared by the chef.", "The guests devoured the food.", "The waiter served the drinks."],
      correct: 1, explanation: "In 'A feast was prepared by the chef', the grammatical subject receives the action."
    },
    {
      id: "g3", category: "grammar", difficulty: "normal",
      question: "Select the sentence with correct subject-verb agreement:",
      options: ["The collection of rare books are valuable.", "The collection of rare books is valuable.", "The collection of rare books were valuable.", "The collection of rare books have been valuable."],
      correct: 1, explanation: "The head noun of the subject is the singular 'collection', so the verb must be 'is'."
    },
    {
      id: "g4", category: "grammar", difficulty: "hard",
      question: "Which sentence uses the past perfect tense?",
      options: ["I had finished my homework before dinner.", "I finished my homework before dinner.", "I have finished my homework today.", "I was finishing my homework."],
      correct: 0, explanation: "'Had finished' is past perfect (had + past participle), indicating an action completed prior to another past event."
    },
    {
      id: "g5", category: "grammar", difficulty: "expert",
      question: "Choose the subjunctive mood sentence:",
      options: ["If I was you, I would take the offer.", "If I were you, I would take the offer.", "I am taking the offer.", "She was hoping you took the offer."],
      correct: 1, explanation: "The hypothetical conditional uses the subjunctive 'were' ('If I were you')."
    },
    {
      id: "g6", category: "grammar", difficulty: "normal",
      question: "Which word is an adverb in this sentence: 'The dancer moved extraordinarily gracefully across the stage.'",
      options: ["dancer", "gracefully", "moved", "stage"],
      correct: 1, explanation: "'Gracefully' (and 'extraordinarily') modifies the verb 'moved', describing how she danced."
    },

    // --- Spelling & Tricky Words ---
    {
      id: "s1", category: "spelling", difficulty: "easy",
      question: "Select the correctly spelled word:",
      options: ["Acommodate", "Accommodate", "Acomodate", "Accomadate"],
      correct: 1, explanation: "'Accommodate' has two c's and two m's."
    },
    {
      id: "s2", category: "spelling", difficulty: "normal",
      question: "Which is the correct spelling?",
      options: ["Hierachy", "Hierarchy", "Heirarchy", "Hierarcy"],
      correct: 1, explanation: "'Hierarchy' is spelled H-I-E-R-A-R-C-H-Y."
    },
    {
      id: "s3", category: "spelling", difficulty: "normal",
      question: "Choose the correct spelling:",
      options: ["Rhythm", "Rythm", "Rhthym", "Rhythim"],
      correct: 0, explanation: "'Rhythm' has no standard vowels except 'y' in the middle: R-H-Y-T-H-M."
    },
    {
      id: "s4", category: "spelling", difficulty: "hard",
      question: "Spot the correctly spelled word:",
      options: ["Mischevious", "Mischievous", "Mischevous", "Mischivious"],
      correct: 1, explanation: "'Mischievous' has only three syllables: mis-chie-vous."
    },
    {
      id: "s5", category: "spelling", difficulty: "hard",
      question: "Which of the following is spelled correctly?",
      options: ["Conscientious", "Consciencious", "Consientious", "Conscensious"],
      correct: 0, explanation: "'Conscientious' is spelled C-O-N-S-C-I-E-N-T-I-O-U-S."
    },

    // --- Synonyms & Antonyms ---
    {
      id: "sa1", category: "synonyms", difficulty: "easy",
      question: "Which word is a SYNONYM for 'abundant'?",
      options: ["Scarce", "Plentiful", "Fragile", "Narrow"],
      correct: 1, explanation: "'Plentiful' and 'abundant' both describe something existing in large quantities."
    },
    {
      id: "sa2", category: "synonyms", difficulty: "normal",
      question: "What is a SYNONYM for 'lucid'?",
      options: ["Murky", "Clear", "Confusing", "Heavy"],
      correct: 1, explanation: "'Lucid' means expressed clearly and easy to understand."
    },
    {
      id: "sa3", category: "antonyms", difficulty: "easy",
      question: "What is an ANTONYM of 'perilous'?",
      options: ["Dangerous", "Safe", "Treacherous", "Risky"],
      correct: 1, explanation: "'Perilous' means full of danger; its direct opposite is 'safe'."
    },
    {
      id: "sa4", category: "antonyms", difficulty: "normal",
      question: "What is the ANTONYM of 'frugal'?",
      options: ["Extravagant", "Thrifty", "Careful", "Modest"],
      correct: 0, explanation: "'Frugal' means economical with money; 'extravagant' means spending lavishly."
    },
    {
      id: "sa5", category: "synonyms", difficulty: "hard",
      question: "Which word is a SYNONYM for 'obstinate'?",
      options: ["Flexible", "Stubborn", "Generous", "Polite"],
      correct: 1, explanation: "'Obstinate' means stubbornly refusing to change one's opinion or action."
    },

    // --- Idioms & Expressions ---
    {
      id: "i1", category: "idioms", difficulty: "easy",
      question: "What does the idiom 'bite the bullet' mean?",
      options: ["To eat quickly", "To face a difficult situation with courage", "To shoot a weapon", "To make an excuse"],
      correct: 1, explanation: "'Bite the bullet' originated from soldiers biting a lead bullet during surgery to endure pain."
    },
    {
      id: "i2", category: "idioms", difficulty: "normal",
      question: "What does 'burn the midnight oil' mean?",
      options: ["To set a fire accidentally", "To work or study late into the night", "To waste precious resources", "To sleep deeply"],
      correct: 1, explanation: "'Burning the midnight oil' refers to studying or working late by oil lamp."
    },
    {
      id: "i3", category: "idioms", difficulty: "normal",
      question: "If someone 'spills the beans', they:",
      options: ["Make a mess at dinner", "Reveal a secret prematurely", "Cook a traditional meal", "Drop their groceries"],
      correct: 1, explanation: "'Spill the beans' means to disclose confidential information, often unintentionally."
    },
    {
      id: "i4", category: "idioms", difficulty: "hard",
      question: "What is meant by 'barking up the wrong tree'?",
      options: ["Hunting woodland animals", "Pursuing a mistaken course of action", "Complaining about nature", "Making a loud disturbance"],
      correct: 1, explanation: "'Barking up the wrong tree' means following a wrong idea or accusing the wrong person."
    },

    // --- Reading Comprehension ---
    {
      id: "rc1", category: "reading", difficulty: "normal",
      question: "Read: 'Although the summit was shrouded in dense mist and winds howled at 50 mph, Elena adjusted her crampons and took the decisive step upward.' What can we infer about Elena?",
      options: ["She was ready to turn back.", "She was determined and experienced.", "She lost her way completely.", "She forgot her climbing gear."],
      correct: 1, explanation: "Continuing forward despite harsh weather shows high determination and skill."
    },
    {
      id: "rc2", category: "reading", difficulty: "hard",
      question: "Read: 'The antique grandfather clock, silent for forty years, struck twelve deep chimes as Arthur unlocked the dusty study door.' What mood is primarily established?",
      options: ["Festive and hilarious", "Mysterious and eerie", "Boring and routine", "Scientific and clinical"],
      correct: 1, explanation: "An old clock suddenly tolling in a forgotten room creates an eerie, mysterious atmosphere."
    },

    // --- Punctuation & Common Mistakes ---
    {
      id: "p1", category: "punctuation", difficulty: "easy",
      question: "Which sentence has correct punctuation?",
      options: ["Lets eat, grandma!", "Lets eat grandma!", "Let's eat, grandma!", "Let's eat grandma!"],
      correct: 2, explanation: "The apostrophe in 'Let's' is needed for the contraction of 'Let us', and the comma before 'grandma' specifies direct address."
    },
    {
      id: "p2", category: "punctuation", difficulty: "normal",
      question: "Which sentence correctly uses a semicolon?",
      options: ["I love apples; and oranges.", "The storm ended; the sun broke through the clouds.", "She walked home; because it was raining.", "There were three dogs; Bruno, Max, and Daisy."],
      correct: 1, explanation: "A semicolon correctly links two independent clauses without a coordinating conjunction."
    },
    {
      id: "cm1", category: "common_mistakes", difficulty: "easy",
      question: "Select the sentence that correctly uses 'their', 'there', or 'they're':",
      options: ["They're putting on they're coats over there.", "Their putting on there coats over they're.", "They're putting on their coats over there.", "There putting on their coats over they're."],
      correct: 2, explanation: "'They're' = they are, 'their' = possessive, 'there' = location."
    },
    {
      id: "cm2", category: "common_mistakes", difficulty: "normal",
      question: "Which sentence correctly uses 'affect' vs 'effect'?",
      options: ["The weather will not effect our picnic plans.", "The weather will not affect our picnic plans.", "The warm climate had a strong affect on the crops.", "She wanted to know the side affects of the medicine."],
      correct: 1, explanation: "'Affect' is usually a verb meaning to influence; 'effect' is usually a noun meaning the result."
    }
  ];

  // 2. PROCEDURAL GENERATOR FOR 520+ UNIQUE CHARACTERS
  // As required: Programmatically generated with id, name, rarity, price, category, description, icon.
  const categories = [
    "Animals", "Robots", "Wizards", "Knights", "Space",
    "Pirates & Ninjas", "Monsters", "Scientists", "Foodies",
    "Fantasy", "Cyber & Retro", "Elements"
  ];

  const rarities = [
    { name: "common", label: "Common", weight: 45, minPrice: 50, maxPrice: 120 },
    { name: "uncommon", label: "Uncommon", weight: 25, minPrice: 150, maxPrice: 320 },
    { name: "rare", label: "Rare", weight: 15, minPrice: 380, maxPrice: 700 },
    { name: "epic", label: "Epic", weight: 10, minPrice: 850, maxPrice: 1500 },
    { name: "legendary", label: "Legendary", weight: 4, minPrice: 1800, maxPrice: 3500 },
    { name: "mythic", label: "Mythic", weight: 1, minPrice: 4500, maxPrice: 8000 }
  ];

  const prefixPool = [
    "Cyber", "Pixel", "Golden", "Shadow", "Cosmic", "Chrono", "Mystic", "Solar",
    "Lunar", "Volcano", "Quantum", "Neon", "Ancient", "Steampunk", "Frost", "Storm",
    "Emerald", "Ruby", "Obsidian", "Radiant", "Turbo", "Phantom", "Atomic", "Galactic",
    "Iron", "Crystal", "Starlight", "Echo", "Blaze", "Vortex", "Captain", "Grand",
    "Doctor", "Professor", "Master", "Prince", "Count", "Aero", "Hyper", "Specter"
  ];

  const baseArchetypes = [
    { base: "Fox", icon: "🦊", cat: "Animals", desc: "A cunning grammatical trickster who loves syntax puzzles." },
    { base: "Panda", icon: "🐼", cat: "Animals", desc: "A peaceful master of vocabulary who meditates on synonyms." },
    { base: "Penguin", icon: "🐧", cat: "Animals", desc: "An icy explorer who slides through vocabulary blizzards." },
    { base: "Owl", icon: "🦉", cat: "Animals", desc: "The ancient scholar of etymology and midnight study sessions." },
    { base: "Tiger", icon: "🐯", cat: "Animals", desc: "Fierce and relentless in speed spelling duels." },
    { base: "Dragon", icon: "🐲", cat: "Monsters", desc: "Breathes radiant fiery idioms upon those who misuse apostrophes." },
    { base: "Robot", icon: "🤖", cat: "Robots", desc: "Equipped with quantum dictionary processors and optical spellcheck." },
    { base: "Mecha", icon: "🦾", cat: "Robots", desc: "Titanium armor reinforced by strong irregular verb conjugation." },
    { base: "Wizard", icon: "🧙‍♂️", cat: "Wizards", desc: "Casts powerful subjunctive spells and sentence enchantment." },
    { base: "Alchemist", icon: "⚗️", cat: "Wizards", desc: "Transmutes plain vocabulary into eloquent poetic gold." },
    { base: "Knight", icon: "🛡️", cat: "Knights", desc: "Defender of punctuation and vanquisher of run-on sentences." },
    { base: "Paladin", icon: "⚔️", cat: "Knights", desc: "Wields the gleaming broadsword of subject-verb agreement." },
    { base: "Astronaut", icon: "🧑‍🚀", cat: "Space", desc: "Floats through the Grammar Galaxy discovering cosmic metaphors." },
    { base: "Alien", icon: "👽", cat: "Space", desc: "Speaks seven hundred interstellar dialects of English." },
    { base: "Pirate", icon: "🏴‍☠️", cat: "Pirates & Ninjas", desc: "Hunts for hidden treasure chests filled with antonyms." },
    { base: "Ninja", icon: "🥷", cat: "Pirates & Ninjas", desc: "Strikes silently in the night to eliminate comma splices." },
    { base: "Yeti", icon: "❄️", cat: "Monsters", desc: "Guardian of frozen vocabulary peaks and ancient runes." },
    { base: "Kraken", icon: "🐙", cat: "Monsters", desc: "Lurks in deep oceans trapping those who confuse 'their' and 'there'." },
    { base: "Chemist", icon: "🧪", cat: "Scientists", desc: "Tests explosive compound sentences in the grammar laboratory." },
    { base: "Astronomer", icon: "🔭", cat: "Scientists", desc: "Gazes through lenses mapping the constellations of literature." },
    { base: "Boba", icon: "🧋", cat: "Foodies", desc: "Sweet, refreshing, and filled with chewy noun pearls." },
    { base: "Taco", icon: "🌮", cat: "Foodies", desc: "Packed with spicy adjectives and crisp adverbial toppings." },
    { base: "Cupcake", icon: "🧁", cat: "Foodies", desc: "Frosted with delicate rhyme schemes and sugary metaphors." },
    { base: "Unicorn", icon: "🦄", cat: "Fantasy", desc: "Leaves a shimmering rainbow trail of correct prepositions." },
    { base: "Fairy", icon: "🧚", cat: "Fantasy", desc: "Sprinkles enchanted apostrophe dust over confused writers." },
    { base: "Hacker", icon: "💻", cat: "Cyber & Retro", desc: "Injects flawless grammar algorithms into broken codebases." },
    { base: "Synth", icon: "🎛️", cat: "Cyber & Retro", desc: "Beats out the rhythmic cadence of iambic pentameter." },
    { base: "Inferno", icon: "🔥", cat: "Elements", desc: "Ignites a passion for active voice and fiery prose." },
    { base: "Blizzard", icon: "🌨️", cat: "Elements", desc: "Cools heated spelling debates with crystal precision." }
  ];

  function generateCharacterDatabase(count = 520) {
    const list = [];
    let idCounter = 1;

    // Guaranteed Starter Character
    list.push({
      id: "char-1",
      name: "Cyber Fox",
      rarity: "common",
      price: 0,
      category: "Animals",
      description: "A nimble neon cyber-canine who serves as your loyal starter guide.",
      icon: "🦊"
    });
    idCounter++;

    // Generate remaining 519 characters with deterministic pseudo-random distribution
    for (let i = 0; i < prefixPool.length; i++) {
      for (let j = 0; j < baseArchetypes.length; j++) {
        if (list.length >= count) break;
        const prefix = prefixPool[i];
        const arch = baseArchetypes[j];
        const name = `${prefix} ${arch.base}`;

        // Skip duplicate of starter
        if (name === "Cyber Fox") continue;

        // Determine rarity by index distribution
        const roll = (i * 37 + j * 13) % 100;
        let rarityObj = rarities[0];
        if (roll < 45) rarityObj = rarities[0]; // Common
        else if (roll < 70) rarityObj = rarities[1]; // Uncommon
        else if (roll < 85) rarityObj = rarities[2]; // Rare
        else if (roll < 95) rarityObj = rarities[3]; // Epic
        else if (roll < 99) rarityObj = rarities[4]; // Legendary
        else rarityObj = rarities[5]; // Mythic

        // Calculate price within rarity band
        const priceSpread = rarityObj.maxPrice - rarityObj.minPrice;
        const price = Math.round((rarityObj.minPrice + (roll % priceSpread)) / 10) * 10;

        list.push({
          id: `char-${idCounter}`,
          name: name,
          rarity: rarityObj.name,
          price: price,
          category: arch.cat,
          description: `${prefix} edition. ${arch.desc}`,
          icon: arch.icon
        });
        idCounter++;
      }
      if (list.length >= count) break;
    }

    return list;
  }

  // 3. 32 COMPREHENSIVE ACHIEVEMENTS
  const achievements = [
    { id: "first_game", title: "First Steps", desc: "Complete your very first English game.", icon: "🎮", rewardCoins: 50, rewardXp: 100 },
    { id: "first_win", title: "Taste of Victory", desc: "Win your first arcade match.", icon: "🏆", rewardCoins: 100, rewardXp: 150 },
    { id: "streak_5", title: "On Fire", desc: "Answer 5 questions in a row correctly.", icon: "🔥", rewardCoins: 75, rewardXp: 120 },
    { id: "streak_10", title: "Unstoppable", desc: "Achieve a 10-answer streak.", icon: "⚡", rewardCoins: 150, rewardXp: 250 },
    { id: "correct_25", title: "Student of Words", desc: "Answer 25 questions correctly overall.", icon: "📚", rewardCoins: 100, rewardXp: 200 },
    { id: "correct_100", title: "Vocabulary Scholar", desc: "Answer 100 questions correctly.", icon: "🎓", rewardCoins: 300, rewardXp: 500 },
    { id: "correct_250", title: "Grammar Titan", desc: "Answer 250 questions correctly.", icon: "🏛️", rewardCoins: 600, rewardXp: 1000 },
    { id: "correct_500", title: "Linguistic Oracle", desc: "Answer 500 questions correctly.", icon: "👑", rewardCoins: 1500, rewardXp: 2500 },
    { id: "level_5", title: "Rising Prodigy", desc: "Reach Player Level 5.", icon: "⭐", rewardCoins: 150, rewardXp: 200 },
    { id: "level_10", title: "Arcade Veteran", desc: "Reach Player Level 10.", icon: "🌟", rewardCoins: 300, rewardXp: 400 },
    { id: "level_25", title: "Grand Master", desc: "Reach Player Level 25.", icon: "💫", rewardCoins: 1000, rewardXp: 1500 },
    { id: "level_50", title: "Legend of the Realm", desc: "Reach Player Level 50.", icon: "🌌", rewardCoins: 2500, rewardXp: 5000 },
    { id: "collector_5", title: "Curator", desc: "Unlock 5 different characters.", icon: "🎒", rewardCoins: 100, rewardXp: 150 },
    { id: "collector_20", title: "Menagerie Keeper", desc: "Unlock 20 characters in the shop.", icon: "🎪", rewardCoins: 300, rewardXp: 400 },
    { id: "collector_50", title: "Grand Collector", desc: "Unlock 50 characters in the shop.", icon: "💎", rewardCoins: 800, rewardXp: 1000 },
    { id: "collector_100", title: "Museum Director", desc: "Unlock 100 distinct characters.", icon: "🏛️", rewardCoins: 2000, rewardXp: 2500 },
    { id: "first_rare", title: "Rare Discovery", desc: "Acquire your first Rare or higher character.", icon: "🔷", rewardCoins: 150, rewardXp: 200 },
    { id: "first_legendary", title: "Golden Radiance", desc: "Equip a Legendary or Mythic character.", icon: "✨", rewardCoins: 500, rewardXp: 750 },
    { id: "coin_hoard_500", title: "Coin Saver", desc: "Accumulate 500 Coins in your bank.", icon: "🪙", rewardCoins: 100, rewardXp: 150 },
    { id: "coin_hoard_2500", title: "Treasury Baron", desc: "Accumulate 2,500 Coins.", icon: "💰", rewardCoins: 350, rewardXp: 500 },
    { id: "tycoon_master", title: "Industrialist", desc: "Generate 1,000 Word Power in English Tycoon.", icon: "🏭", rewardCoins: 200, rewardXp: 300 },
    { id: "tower_architect", title: "Skyscraper Builder", desc: "Stack an 8-floor tower in Word Tower.", icon: "🏗️", rewardCoins: 200, rewardXp: 300 },
    { id: "battle_hero", title: "Dragon Slayer", desc: "Defeat the Syntax Dragon in Grammar Battle.", icon: "⚔️", rewardCoins: 250, rewardXp: 350 },
    { id: "race_champion", title: "Speed Demon", desc: "Outrun your rival in Vocabulary Race.", icon: "🏎️", rewardCoins: 200, rewardXp: 300 },
    { id: "detective_sleuth", title: "Sherlock Holmes", desc: "Solve a mystery in Reading Detective.", icon: "🔍", rewardCoins: 200, rewardXp: 300 },
    { id: "royale_victor", title: "Royale Champion", desc: "Claim 1st place in English Royale.", icon: "🥇", rewardCoins: 400, rewardXp: 600 },
    { id: "community_author", title: "Community Voice", desc: "Publish a post in the Community Hub.", icon: "✍️", rewardCoins: 100, rewardXp: 150 },
    { id: "social_butterfly", title: "Friendly Scholar", desc: "Leave 3 comments on community posts.", icon: "💬", rewardCoins: 100, rewardXp: 150 },
    { id: "party_host", title: "Lobby Leader", desc: "Host a Party multiplayer session.", icon: "👥", rewardCoins: 150, rewardXp: 200 },
    { id: "daily_devotee", title: "Daily Habit", desc: "Claim your 24-hour daily reward.", icon: "🎁", rewardCoins: 100, rewardXp: 150 },
    { id: "perfectionist", title: "Flawless Round", desc: "Complete a game with 100% accuracy.", icon: "🎯", rewardCoins: 200, rewardXp: 300 },
    { id: "all_rounder", title: "Arcade Explorer", desc: "Play at least 10 different game modes.", icon: "🧭", rewardCoins: 500, rewardXp: 700 }
  ];

  const characterDatabase = generateCharacterDatabase(520);

  return {
    questions,
    categories,
    rarities,
    characters: characterDatabase,
    achievements
  };
})();
