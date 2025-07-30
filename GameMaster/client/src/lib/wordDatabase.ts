import type { BitWord, Difficulty } from "@shared/schema";

// This is a client-side reference of Bitcoin terminology
// The actual game words come from the server API
export const bitcoinTerminologyReference: Record<Difficulty, Partial<BitWord>[]> = {
  beginner: [
    {
      word: "BITCOIN",
      category: "Digital Currency",
      definition: "A decentralized digital currency that operates without a central authority",
      hint: "The first and most well-known cryptocurrency",
      funFact: "Created by the pseudonymous Satoshi Nakamoto in 2009"
    },
    {
      word: "WALLET",
      category: "Storage",
      definition: "Software or hardware that stores Bitcoin private keys",
      hint: "Digital container for your Bitcoin",
      funFact: "Can be hot (online) or cold (offline) storage"
    },
    {
      word: "MINING",
      category: "Process", 
      definition: "The process of validating transactions and adding them to the blockchain",
      hint: "Digital gold rush activity using computational power",
      funFact: "Miners compete to solve complex mathematical puzzles"
    },
    {
      word: "SATOSHI",
      category: "Unit",
      definition: "The smallest unit of Bitcoin, equal to 0.00000001 BTC",
      hint: "Named after Bitcoin's creator",
      funFact: "There are 100 million satoshis in one Bitcoin"
    },
    {
      word: "BLOCKCHAIN",
      category: "Technology",
      definition: "A distributed ledger technology that maintains a growing list of records",
      hint: "Chain of cryptographically linked blocks",
      funFact: "Each block contains a timestamp and link to the previous block"
    }
  ],
  
  intermediate: [
    {
      word: "DEFLATION",
      category: "Economics",
      definition: "A decrease in the general price level of goods and services", 
      hint: "Opposite of inflation, Bitcoin's economic property",
      funFact: "Bitcoin's fixed supply makes it naturally deflationary"
    },
    {
      word: "HODLING",
      category: "Strategy",
      definition: "A long-term investment strategy of holding Bitcoin regardless of market volatility",
      hint: "Hold On for Dear Life - popular Bitcoin strategy",
      funFact: "Term originated from a misspelled 'holding' in a Bitcoin forum"
    },
    {
      word: "HALVING",
      category: "Event",
      definition: "An event that reduces the Bitcoin mining reward by half",
      hint: "Happens approximately every 4 years",
      funFact: "Designed to control Bitcoin's inflation rate"
    },
    {
      word: "SCARCITY",
      category: "Economics",
      definition: "The fundamental economic problem of limited resources",
      hint: "Bitcoin's key value proposition with 21M cap",
      funFact: "Only 21 million Bitcoin will ever exist"
    }
  ],
  
  advanced: [
    {
      word: "PROOFOFWORK",
      category: "Consensus",
      definition: "A consensus mechanism that requires computational work to validate transactions",
      hint: "Mining validation method securing Bitcoin",
      funFact: "Invented by Hal Finney and used in Bitcoin's design"
    },
    {
      word: "UTXO",
      category: "Technical",
      definition: "Unspent Transaction Output - Bitcoin's accounting model",
      hint: "Bitcoin's unique transaction model",
      funFact: "Each Bitcoin transaction consumes UTXOs and creates new ones"
    },
    {
      word: "HASHRATE",
      category: "Mining",
      definition: "The total computational power securing the Bitcoin network",
      hint: "Network security measurement in hashes per second",
      funFact: "Higher hashrate means more secure network"
    },
    {
      word: "LIGHTNING",
      category: "Scaling",
      definition: "A second-layer payment protocol for fast Bitcoin transactions",
      hint: "Layer 2 solution for instant payments",
      funFact: "Enables micropayments and instant transactions"
    }
  ]
};

export const difficultyDescriptions = {
  beginner: "Basic Bitcoin terms like wallet, blockchain, and satoshi",
  intermediate: "Austrian economics concepts and Bitcoin business models",
  advanced: "Technical Bitcoin concepts, mining, and cryptography"
};

export const difficultyColors = {
  beginner: {
    primary: "green-600",
    bg: "green-600/20",
    border: "green-600/30",
    text: "green-300"
  },
  intermediate: {
    primary: "bitcoin",
    bg: "bitcoin/20", 
    border: "bitcoin/30",
    text: "bitcoin"
  },
  advanced: {
    primary: "red-600",
    bg: "red-600/20",
    border: "red-600/30", 
    text: "red-300"
  }
};
