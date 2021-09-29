package blockchainStore

import (
	"sort"
	"strconv"
	"sync"

	"myapp/internal/miner"
)

// Block is a blockchain's structure
type Block struct {
	Id    int    `json:"id" binding:"required"`
	Nonce int    `json:"nonce"`
	Data  string `json:"data"`
	Prev  string `json:"prev" binding:"required"`
	Hash  string `json:"hash" binding:"required"`
	Valid bool   `json:"valid"`
}

// BlockchainStore is a simple in-memory database of blocks; BlockchainStore methods are
// safe to call concurrently.
type BlockchainStore struct {
	sync.Mutex

	blockchain map[int]Block
	nextId     int
	prevHash   string
}

// New returns new BlockchainStore
func New() *BlockchainStore {
	bs := &BlockchainStore{}
	bs.blockchain = make(map[int]Block)
	bs.nextId = 1
	// previous hash for the first block in chain is omitted
	bs.prevHash = "0000000000000000000000000000000000000000000000000000000000000000"

	// hardcode for count of blocks :)
	for i := 1; i <= 4; i++ {
		bs.CreateBlock()
	}

	return bs
}

// GetBlockchain returns all the blockchain in the store
func (bs *BlockchainStore) GetBlockchain() []Block {
	blockchain := make([]Block, 0, len(bs.blockchain))
	for _, block := range bs.blockchain {
		blockchain = append(blockchain, block)
	}
	sort.Slice(blockchain, func(i, j int) bool {
		return blockchain[i].Id < blockchain[j].Id
	})
	return blockchain
}

// MineBlock returns mined block from a raw block
func (bs *BlockchainStore) MineBlock(block Block) Block {
	dataShot := strconv.Itoa(block.Id) + block.Data  + block.Prev
	block.Nonce, block.Hash = miner.Mine(dataShot)
	block.Valid = true
	return block
}

// CreateBlock creates a new block in the blockchain.
func (bs *BlockchainStore) CreateBlock() {
	bs.Lock()
	defer bs.Unlock()

	// hardcode for data example :)
	data := "Some data" + strconv.Itoa(bs.nextId)
	dataShot := strconv.Itoa(bs.nextId) + data + bs.prevHash
	nonce, hash := miner.Mine(dataShot)

	block := Block{
		Id:    bs.nextId,
		Nonce: nonce,
		Data:  data,
		Prev:  bs.prevHash,
		Hash:  hash,
		Valid: true,
	}

	bs.prevHash = hash
	bs.blockchain[bs.nextId] = block
	bs.nextId++
}
