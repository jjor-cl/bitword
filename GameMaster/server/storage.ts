import { 
  users, 
  games, 
  gameStats, 
  bitWords,
  type User, 
  type InsertUser, 
  type Game,
  type InsertGame,
  type GameStats,
  type InsertGameStats,
  type BitWord,
  type InsertBitWord,
  type Difficulty,
  type GameResult
} from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull, gte, lt, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // BitWord operations
  getBitWords(): Promise<BitWord[]>;
  getBitWordsByDifficulty(difficulty: Difficulty): Promise<BitWord[]>;
  getTodaysBitWord(difficulty: Difficulty): Promise<BitWord | undefined>;
  createBitWord(bitWord: InsertBitWord): Promise<BitWord>;

  // Game operations
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined>;
  getUserGames(userId?: number): Promise<Game[]>;
  getTodaysGame(difficulty: Difficulty, userId?: number): Promise<Game | undefined>;

  // Stats operations
  getGameStats(difficulty: Difficulty, userId?: number): Promise<GameStats | undefined>;
  updateGameStats(difficulty: Difficulty, result: GameResult, userId?: number): Promise<GameStats>;
  getAllGameStats(userId?: number): Promise<GameStats[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeBitWords();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // BitWord operations
  async getBitWords(): Promise<BitWord[]> {
    return await db.select().from(bitWords).where(eq(bitWords.isActive, true));
  }

  async getBitWordsByDifficulty(difficulty: Difficulty): Promise<BitWord[]> {
    return await db.select().from(bitWords).where(
      eq(bitWords.difficulty, difficulty)
    );
  }

  async getTodaysBitWord(difficulty: Difficulty): Promise<BitWord | undefined> {
    const words = await this.getBitWordsByDifficulty(difficulty);
    if (words.length === 0) return undefined;
    
    // Use date-based selection for consistent daily words
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const index = seed % words.length;
    
    return words[index];
  }

  async createBitWord(insertBitWord: InsertBitWord): Promise<BitWord> {
    const [bitWord] = await db
      .insert(bitWords)
      .values(insertBitWord)
      .returning();
    return bitWord;
  }

  // Game operations
  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db
      .insert(games)
      .values(insertGame)
      .returning();
    return game;
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined> {
    const [updatedGame] = await db
      .update(games)
      .set(updates)
      .where(eq(games.id, id))
      .returning();
    return updatedGame || undefined;
  }

  async getUserGames(userId?: number): Promise<Game[]> {
    if (userId) {
      return await db.select().from(games).where(eq(games.userId, userId));
    }
    return await db.select().from(games);
  }

  async getTodaysGame(difficulty: Difficulty, userId?: number): Promise<Game | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const conditions = [
      eq(games.difficulty, difficulty),
      gte(games.createdAt, today),
      lt(games.createdAt, tomorrow)
    ];
    
    if (userId) {
      conditions.push(eq(games.userId, userId));
    } else {
      conditions.push(sql`${games.userId} IS NULL`);
    }

    const [game] = await db.select().from(games).where(and(...conditions));
    return game || undefined;
  }

  // Stats operations
  async getGameStats(difficulty: Difficulty, userId?: number): Promise<GameStats | undefined> {
    if (userId) {
      const [stats] = await db.select().from(gameStats).where(
        and(eq(gameStats.difficulty, difficulty), eq(gameStats.userId, userId))
      );
      return stats || undefined;
    } else {
      const [stats] = await db.select().from(gameStats).where(
        and(eq(gameStats.difficulty, difficulty), sql`${gameStats.userId} IS NULL`)
      );
      return stats || undefined;
    }
  }

  async updateGameStats(difficulty: Difficulty, result: GameResult, userId?: number): Promise<GameStats> {
    let existingStats = await this.getGameStats(difficulty, userId);
    
    if (!existingStats) {
      const [newStats] = await db
        .insert(gameStats)
        .values({
          userId: userId || null,
          difficulty,
          totalGames: 1,
          totalWins: result.isWon ? 1 : 0,
          currentStreak: result.isWon ? 1 : 0,
          bestStreak: result.isWon ? 1 : 0,
          averageTime: result.timeSeconds,
          totalHints: result.hintsUsed
        })
        .returning();
      return newStats;
    }

    // Update existing stats
    const newTotalGames = (existingStats.totalGames || 0) + 1;
    const newTotalWins = (existingStats.totalWins || 0) + (result.isWon ? 1 : 0);
    const newCurrentStreak = result.isWon ? (existingStats.currentStreak || 0) + 1 : 0;
    const newBestStreak = Math.max(existingStats.bestStreak || 0, newCurrentStreak);
    const newTotalHints = (existingStats.totalHints || 0) + result.hintsUsed;
    
    // Calculate new average time
    const oldAverage = existingStats.averageTime || 0;
    const newAverage = Math.round(
      (oldAverage * (newTotalGames - 1) + result.timeSeconds) / newTotalGames
    );

    const [updatedStats] = await db
      .update(gameStats)
      .set({
        totalGames: newTotalGames,
        totalWins: newTotalWins,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        averageTime: newAverage,
        totalHints: newTotalHints
      })
      .where(eq(gameStats.id, existingStats.id))
      .returning();

    return updatedStats;
  }

  async getAllGameStats(userId?: number): Promise<GameStats[]> {
    if (userId) {
      return await db.select().from(gameStats).where(eq(gameStats.userId, userId));
    }
    return await db.select().from(gameStats).where(sql`${gameStats.userId} IS NULL`);
  }

  private async initializeBitWords() {
    try {
      // Check if words already exist
      const existingWords = await db.select().from(bitWords);
      if (existingWords.length > 0) {
        return; // Words already initialized
      }

      const initialWords: InsertBitWord[] = [
        // Beginner words (30 words)
        { word: "BITCOIN", difficulty: "beginner", category: "Digital Currency", definition: "A decentralized digital currency that operates without a central authority", hint: "The first and most well-known cryptocurrency", funFact: "Created by the pseudonymous Satoshi Nakamoto in 2009", isActive: true },
        { word: "WALLET", difficulty: "beginner", category: "Storage", definition: "Software or hardware that stores Bitcoin private keys", hint: "Digital container for your Bitcoin", funFact: "Can be hot (online) or cold (offline) storage", isActive: true },
        { word: "MINING", difficulty: "beginner", category: "Process", definition: "The process of validating transactions and adding them to the blockchain", hint: "Digital gold rush activity using computational power", funFact: "Miners compete to solve complex mathematical puzzles", isActive: true },
        { word: "SATOSHI", difficulty: "beginner", category: "Unit", definition: "The smallest unit of Bitcoin, equal to 0.00000001 BTC", hint: "Named after Bitcoin's creator", funFact: "There are 100 million satoshis in one Bitcoin", isActive: true },
        { word: "BLOCKCHAIN", difficulty: "beginner", category: "Technology", definition: "A distributed ledger technology that maintains a growing list of records", hint: "Chain of cryptographically linked blocks", funFact: "Each block contains a timestamp and link to the previous block", isActive: true },
        { word: "PRIVATE", difficulty: "beginner", category: "Security", definition: "A secret key that allows you to spend Bitcoin from an address", hint: "Secret key for accessing your Bitcoin", funFact: "If you lose this, you lose access to your Bitcoin forever", isActive: true },
        { word: "ADDRESS", difficulty: "beginner", category: "Identity", definition: "A unique identifier where Bitcoin can be sent", hint: "Like a bank account number for Bitcoin", funFact: "Typically starts with 1, 3, or bc1", isActive: true },
        { word: "HASH", difficulty: "beginner", category: "Cryptography", definition: "A mathematical function that converts input data into a fixed-size string", hint: "Digital fingerprint of data", funFact: "Bitcoin uses SHA-256 hashing algorithm", isActive: true },
        { word: "NODE", difficulty: "beginner", category: "Network", definition: "A computer that participates in the Bitcoin network", hint: "Network participant running Bitcoin software", funFact: "Full nodes validate all transactions and blocks", isActive: true },
        { word: "MINER", difficulty: "beginner", category: "Participant", definition: "A person or entity that validates Bitcoin transactions through mining", hint: "Digital gold prospector", funFact: "Miners receive Bitcoin rewards for securing the network", isActive: true },
        { word: "BLOCK", difficulty: "beginner", category: "Structure", definition: "A collection of Bitcoin transactions grouped together", hint: "Building block of the blockchain", funFact: "New blocks are created approximately every 10 minutes", isActive: true },
        { word: "PEER", difficulty: "beginner", category: "Network", definition: "Another participant in the Bitcoin peer-to-peer network", hint: "Network neighbor in distributed system", funFact: "Bitcoin operates on a peer-to-peer network without central servers", isActive: true },
        { word: "SEED", difficulty: "beginner", category: "Security", definition: "A series of words used to recover a Bitcoin wallet", hint: "Recovery phrase for your wallet", funFact: "Usually consists of 12 or 24 words", isActive: true },
        { word: "EXCHANGE", difficulty: "beginner", category: "Platform", definition: "A platform where Bitcoin can be bought, sold, or traded", hint: "Marketplace for Bitcoin trading", funFact: "First Bitcoin exchange was BitcoinMarket.com in 2010", isActive: true },
        { word: "DIGITAL", difficulty: "beginner", category: "Property", definition: "Existing only in electronic form, not physical", hint: "Opposite of physical cash", funFact: "Bitcoin is purely digital with no physical representation", isActive: true },
        { word: "LEDGER", difficulty: "beginner", category: "Record", definition: "A record of all Bitcoin transactions", hint: "Public transaction record book", funFact: "Bitcoin's ledger is transparent and publicly auditable", isActive: true },
        { word: "NETWORK", difficulty: "beginner", category: "System", definition: "The global system of computers running Bitcoin software", hint: "Global computer network for Bitcoin", funFact: "Bitcoin network operates 24/7 across the globe", isActive: true },
        { word: "BALANCE", difficulty: "beginner", category: "Account", definition: "The amount of Bitcoin held in a wallet", hint: "How much Bitcoin you own", funFact: "Bitcoin balances are tracked through UTXOs", isActive: true },
        { word: "TRANSFER", difficulty: "beginner", category: "Action", definition: "The act of sending Bitcoin from one address to another", hint: "Moving Bitcoin between wallets", funFact: "Bitcoin transfers are irreversible once confirmed", isActive: true },
        { word: "CONFIRM", difficulty: "beginner", category: "Process", definition: "The process of including a transaction in a block", hint: "Transaction verification process", funFact: "More confirmations mean higher security", isActive: true },
        { word: "FEE", difficulty: "beginner", category: "Cost", definition: "Payment made to miners for processing a transaction", hint: "Cost to send Bitcoin", funFact: "Higher fees typically result in faster confirmation", isActive: true },
        { word: "REWARD", difficulty: "beginner", category: "Incentive", definition: "Bitcoin given to miners for successfully mining a block", hint: "Miner compensation for securing network", funFact: "Block reward started at 50 BTC and halves every 4 years", isActive: true },
        { word: "BACKUP", difficulty: "beginner", category: "Security", definition: "A copy of wallet data to protect against loss", hint: "Safety copy of your wallet", funFact: "Regular backups prevent permanent loss of Bitcoin", isActive: true },
        { word: "COLD", difficulty: "beginner", category: "Storage", definition: "Storing Bitcoin offline for enhanced security", hint: "Offline storage method", funFact: "Cold storage protects against online attacks", isActive: true },
        { word: "HOT", difficulty: "beginner", category: "Storage", definition: "Storing Bitcoin online for easy access", hint: "Online storage method", funFact: "Hot wallets are convenient but less secure", isActive: true },
        { word: "PAPER", difficulty: "beginner", category: "Wallet", definition: "A physical document containing Bitcoin private keys", hint: "Physical backup of digital keys", funFact: "Paper wallets are immune to cyber attacks", isActive: true },
        { word: "HARDWARE", difficulty: "beginner", category: "Wallet", definition: "A physical device designed to store Bitcoin securely", hint: "Physical device for Bitcoin storage", funFact: "Hardware wallets keep private keys offline", isActive: true },
        { word: "SOFTWARE", difficulty: "beginner", category: "Wallet", definition: "A computer program used to manage Bitcoin", hint: "Digital wallet application", funFact: "Software wallets run on computers or smartphones", isActive: true },
        { word: "MOBILE", difficulty: "beginner", category: "Wallet", definition: "A smartphone application for managing Bitcoin", hint: "Smartphone Bitcoin app", funFact: "Mobile wallets enable Bitcoin payments on-the-go", isActive: true },
        { word: "DESKTOP", difficulty: "beginner", category: "Wallet", definition: "A computer application for managing Bitcoin", hint: "Computer Bitcoin application", funFact: "Desktop wallets offer more features than mobile versions", isActive: true },

        // Intermediate words (30 words)
        { word: "DEFLATION", difficulty: "intermediate", category: "Economics", definition: "A decrease in the general price level of goods and services", hint: "Opposite of inflation, Bitcoin's economic property", funFact: "Bitcoin's fixed supply makes it naturally deflationary", isActive: true },
        { word: "HODLING", difficulty: "intermediate", category: "Strategy", definition: "A long-term investment strategy of holding Bitcoin regardless of market volatility", hint: "Hold On for Dear Life - popular Bitcoin strategy", funFact: "Term originated from a misspelled 'holding' in a Bitcoin forum", isActive: true },
        { word: "HALVING", difficulty: "intermediate", category: "Event", definition: "An event that reduces the Bitcoin mining reward by half", hint: "Happens approximately every 4 years", funFact: "Designed to control Bitcoin's inflation rate", isActive: true },
        { word: "MONETARY", difficulty: "intermediate", category: "Economics", definition: "Related to money supply and monetary policy", hint: "Bitcoin offers an alternative to traditional policy", funFact: "Bitcoin operates outside traditional monetary systems", isActive: true },
        { word: "SCARCITY", difficulty: "intermediate", category: "Economics", definition: "The fundamental economic problem of limited resources", hint: "Bitcoin's key value proposition with 21M cap", funFact: "Only 21 million Bitcoin will ever exist", isActive: true },
        { word: "SOVEREIGNTY", difficulty: "intermediate", category: "Philosophy", definition: "Self-governance and independence from external control", hint: "Bitcoin enables financial self-sovereignty", funFact: "Core principle of Bitcoin's design philosophy", isActive: true },
        { word: "INFLATION", difficulty: "intermediate", category: "Economics", definition: "General increase in prices and fall in purchasing power", hint: "What Bitcoin aims to protect against", funFact: "Bitcoin's fixed supply protects against monetary inflation", isActive: true },
        { word: "VOLATILITY", difficulty: "intermediate", category: "Market", definition: "The degree of variation in Bitcoin's price over time", hint: "Price fluctuation characteristic", funFact: "Bitcoin's volatility has decreased as adoption increased", isActive: true },
        { word: "ADOPTION", difficulty: "intermediate", category: "Growth", definition: "The process of Bitcoin becoming more widely accepted", hint: "Growing acceptance and usage", funFact: "Institutional adoption began accelerating in 2020", isActive: true },
        { word: "LIQUIDITY", difficulty: "intermediate", category: "Market", definition: "The ease with which Bitcoin can be bought or sold", hint: "How easily Bitcoin can be traded", funFact: "Higher liquidity reduces price impact of large trades", isActive: true },
        { word: "CUSTODY", difficulty: "intermediate", category: "Service", definition: "The safekeeping of Bitcoin on behalf of others", hint: "Third-party storage service", funFact: "Institutional custody services enable corporate adoption", isActive: true },
        { word: "RESERVE", difficulty: "intermediate", category: "Asset", definition: "Bitcoin held as a store of value by institutions", hint: "Corporate treasury allocation", funFact: "MicroStrategy was first public company to hold Bitcoin reserves", isActive: true },
        { word: "STANDARD", difficulty: "intermediate", category: "Economics", definition: "A monetary system based on a specific asset", hint: "Potential future monetary basis", funFact: "Bitcoin standard could replace fiat monetary systems", isActive: true },
        { word: "CIRCULAR", difficulty: "intermediate", category: "Economy", definition: "An economy where Bitcoin is used for all transactions", hint: "Bitcoin-only economic system", funFact: "El Salvador is building a circular Bitcoin economy", isActive: true },
        { word: "ORANGE", difficulty: "intermediate", category: "Culture", definition: "Getting someone interested in Bitcoin", hint: "Converting someone to Bitcoin", funFact: "Orange-pilling refers to Bitcoin's orange branding color", isActive: true },
        { word: "STACKING", difficulty: "intermediate", category: "Strategy", definition: "Regularly accumulating Bitcoin over time", hint: "Dollar-cost averaging into Bitcoin", funFact: "Stacking sats means buying small amounts regularly", isActive: true },
        { word: "WHALE", difficulty: "intermediate", category: "Participant", definition: "An individual or entity holding large amounts of Bitcoin", hint: "Large Bitcoin holder", funFact: "Whale movements can influence market prices", isActive: true },
        { word: "DIAMOND", difficulty: "intermediate", category: "Behavior", definition: "Having strong conviction to hold Bitcoin long-term", hint: "Unshakeable belief in Bitcoin", funFact: "Diamond hands resist selling during market downturns", isActive: true },
        { word: "CORRELATION", difficulty: "intermediate", category: "Analysis", definition: "Statistical relationship between Bitcoin and other assets", hint: "How Bitcoin moves relative to other markets", funFact: "Bitcoin's correlation with traditional assets varies over time", isActive: true },
        { word: "PREMIUM", difficulty: "intermediate", category: "Pricing", definition: "Additional cost above spot price for Bitcoin products", hint: "Extra cost for Bitcoin exposure", funFact: "Bitcoin ETFs often trade at premiums to net asset value", isActive: true },
        { word: "ARBITRAGE", difficulty: "intermediate", category: "Trading", definition: "Profiting from price differences across different markets", hint: "Exploiting price differences", funFact: "Arbitrage helps equalize Bitcoin prices across exchanges", isActive: true },
        { word: "FUTURES", difficulty: "intermediate", category: "Derivatives", definition: "Contracts to buy or sell Bitcoin at a future date", hint: "Derivative trading instrument", funFact: "Bitcoin futures enable institutional exposure without custody", isActive: true },
        { word: "OPTIONS", difficulty: "intermediate", category: "Derivatives", definition: "Contracts giving the right to buy or sell Bitcoin", hint: "Financial derivative for Bitcoin", funFact: "Bitcoin options provide leveraged exposure and hedging", isActive: true },
        { word: "MARGIN", difficulty: "intermediate", category: "Trading", definition: "Borrowing money to trade larger positions in Bitcoin", hint: "Leveraged trading method", funFact: "Margin trading amplifies both gains and losses", isActive: true },
        { word: "LEVERAGE", difficulty: "intermediate", category: "Trading", definition: "Using borrowed capital to increase potential returns", hint: "Amplified trading exposure", funFact: "High leverage can lead to rapid liquidation", isActive: true },
        { word: "SHORTING", difficulty: "intermediate", category: "Trading", definition: "Betting that Bitcoin's price will decrease", hint: "Profiting from price declines", funFact: "Short selling involves borrowing and selling Bitcoin", isActive: true },
        { word: "LONGING", difficulty: "intermediate", category: "Trading", definition: "Betting that Bitcoin's price will increase", hint: "Profiting from price increases", funFact: "Going long means buying with expectation of price rise", isActive: true },
        { word: "SUPPORT", difficulty: "intermediate", category: "Analysis", definition: "A price level where Bitcoin historically stops falling", hint: "Price floor in technical analysis", funFact: "Support levels often become resistance when broken", isActive: true },
        { word: "RESISTANCE", difficulty: "intermediate", category: "Analysis", definition: "A price level where Bitcoin historically stops rising", hint: "Price ceiling in technical analysis", funFact: "Resistance levels often become support when broken", isActive: true },
        { word: "BULL", difficulty: "intermediate", category: "Market", definition: "A market characterized by rising Bitcoin prices", hint: "Optimistic market condition", funFact: "Bull markets can last several years in Bitcoin", isActive: true },

        // Advanced words (30 words)
        { word: "PROOFOFWORK", difficulty: "advanced", category: "Consensus", definition: "A consensus mechanism that requires computational work to validate transactions", hint: "Mining validation method securing Bitcoin", funFact: "Invented by Hal Finney and used in Bitcoin's design", isActive: true },
        { word: "UTXO", difficulty: "advanced", category: "Technical", definition: "Unspent Transaction Output - Bitcoin's accounting model", hint: "Bitcoin's unique transaction model", funFact: "Each Bitcoin transaction consumes UTXOs and creates new ones", isActive: true },
        { word: "HASHRATE", difficulty: "advanced", category: "Mining", definition: "The total computational power securing the Bitcoin network", hint: "Network security measurement in hashes per second", funFact: "Higher hashrate means more secure network", isActive: true },
        { word: "MERKLE", difficulty: "advanced", category: "Technical", definition: "A tree structure used to efficiently verify transaction data", hint: "Tree structure for efficient data verification", funFact: "Named after computer scientist Ralph Merkle", isActive: true },
        { word: "SCHNORR", difficulty: "advanced", category: "Cryptography", definition: "A digital signature scheme used in Bitcoin's Taproot upgrade", hint: "Advanced signature scheme in Bitcoin", funFact: "Provides better privacy and efficiency than ECDSA", isActive: true },
        { word: "LIGHTNING", difficulty: "advanced", category: "Scaling", definition: "A second-layer payment protocol for fast Bitcoin transactions", hint: "Layer 2 solution for instant payments", funFact: "Enables micropayments and instant transactions", isActive: true },
        { word: "TIMELOCK", difficulty: "advanced", category: "Technical", definition: "A condition that prevents spending Bitcoin until a specific time", hint: "Time-based spending condition in Bitcoin", funFact: "Can be absolute or relative time constraints", isActive: true },
        { word: "SEGWIT", difficulty: "advanced", category: "Upgrade", definition: "Segregated Witness - a Bitcoin protocol upgrade", hint: "2017 Bitcoin upgrade for efficiency", funFact: "Separated signatures from transaction data", isActive: true },
        { word: "TAPROOT", difficulty: "advanced", category: "Upgrade", definition: "A Bitcoin upgrade improving privacy and smart contracts", hint: "2021 Bitcoin upgrade for privacy", funFact: "Makes complex transactions look like simple ones", isActive: true },
        { word: "MULTISIG", difficulty: "advanced", category: "Security", definition: "Requiring multiple signatures to authorize a transaction", hint: "Multiple key security mechanism", funFact: "Commonly used for corporate Bitcoin custody", isActive: true },
        { word: "NONCE", difficulty: "advanced", category: "Mining", definition: "A number used once in the mining process", hint: "Variable adjusted by miners", funFact: "Miners increment nonce to find valid block hash", isActive: true },
        { word: "DIFFICULTY", difficulty: "advanced", category: "Mining", definition: "A measure of how hard it is to mine a Bitcoin block", hint: "Mining computational requirement", funFact: "Adjusts every 2016 blocks to maintain 10-minute intervals", isActive: true },
        { word: "TARGET", difficulty: "advanced", category: "Mining", definition: "The value that a block hash must be less than to be valid", hint: "Mining success threshold", funFact: "Lower target means higher difficulty", isActive: true },
        { word: "COINBASE", difficulty: "advanced", category: "Transaction", definition: "The first transaction in a block that pays the miner", hint: "Block reward transaction", funFact: "Only transaction that creates new Bitcoin", isActive: true },
        { word: "ORPHAN", difficulty: "advanced", category: "Block", definition: "A valid block that is not part of the main chain", hint: "Discarded valid block", funFact: "Occurs when two miners find blocks simultaneously", isActive: true },
        { word: "FORK", difficulty: "advanced", category: "Network", definition: "A change to Bitcoin's protocol rules", hint: "Protocol modification event", funFact: "Can be soft (backward compatible) or hard (incompatible)", isActive: true },
        { word: "SCRIPT", difficulty: "advanced", category: "Programming", definition: "Bitcoin's programming language for transaction conditions", hint: "Bitcoin's scripting system", funFact: "Stack-based programming language", isActive: true },
        { word: "OPCODES", difficulty: "advanced", category: "Programming", definition: "Operation codes used in Bitcoin Script", hint: "Bitcoin script commands", funFact: "Limited set of operations for security", isActive: true },
        { word: "BLOOM", difficulty: "advanced", category: "Privacy", definition: "A filter used to privately request relevant transactions", hint: "Privacy filter for light clients", funFact: "Allows selective transaction downloading", isActive: true },
        { word: "COINJOIN", difficulty: "advanced", category: "Privacy", definition: "A privacy technique mixing multiple transactions", hint: "Transaction mixing for privacy", funFact: "Makes transaction analysis more difficult", isActive: true },
        { word: "CHANNEL", difficulty: "advanced", category: "Lightning", definition: "A payment channel in the Lightning Network", hint: "Lightning Network payment route", funFact: "Enables multiple off-chain transactions", isActive: true },
        { word: "ROUTING", difficulty: "advanced", category: "Lightning", definition: "Finding payment paths in the Lightning Network", hint: "Lightning payment pathfinding", funFact: "Uses onion routing for privacy", isActive: true },
        { word: "HTLC", difficulty: "advanced", category: "Lightning", definition: "Hash Time-Locked Contract for secure Lightning payments", hint: "Lightning Network smart contract", funFact: "Ensures atomic payments across multiple hops", isActive: true },
        { word: "WATCHTOWER", difficulty: "advanced", category: "Lightning", definition: "A service monitoring Lightning channels for fraud", hint: "Lightning Network security service", funFact: "Protects offline Lightning nodes", isActive: true },
        { word: "SUBMARINE", difficulty: "advanced", category: "Lightning", definition: "Swapping between on-chain and Lightning Bitcoin", hint: "Chain-Lightning exchange mechanism", funFact: "Enables seamless movement between layers", isActive: true },
        { word: "PSBT", difficulty: "advanced", category: "Technical", definition: "Partially Signed Bitcoin Transaction standard", hint: "Multi-party transaction signing format", funFact: "Enables collaborative transaction construction", isActive: true },
        { word: "DESCRIPTORS", difficulty: "advanced", category: "Technical", definition: "A language for describing Bitcoin script templates", hint: "Script template description language", funFact: "Simplifies wallet software development", isActive: true },
        { word: "MINISCRIPT", difficulty: "advanced", category: "Programming", definition: "A subset of Bitcoin Script for analysis and composition", hint: "Structured Bitcoin scripting language", funFact: "Makes complex scripts more analyzable", isActive: true },
        { word: "COVENANT", difficulty: "advanced", category: "Technical", definition: "Restrictions on how Bitcoin can be spent in the future", hint: "Future spending restrictions", funFact: "Proposed feature for advanced Bitcoin contracts", isActive: true },
        { word: "SIGHASH", difficulty: "advanced", category: "Cryptography", definition: "Flags determining which parts of a transaction are signed", hint: "Signature scope control mechanism", funFact: "Different flags enable various transaction types", isActive: true }
      ];

      await db.insert(bitWords).values(initialWords);
    } catch (error) {
      console.error('Failed to initialize BitWords:', error);
    }
  }
}

export const storage = new DatabaseStorage();
