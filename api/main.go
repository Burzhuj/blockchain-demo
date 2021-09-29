package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"myapp/internal/blockchainStore"
)

type blockchainServer struct {
	store *blockchainStore.BlockchainStore
}

func NewBlockchainServer() *blockchainServer {
	store := blockchainStore.New()
	return &blockchainServer{store: store}
}

func main() {
	// Set the router
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(CORSMiddleware())

	server := NewBlockchainServer()

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/blockchain", server.getBlockchainHandler)
		api.POST("/mine", server.mineHandler)
	}

	// Start and run the server
	err := router.Run(":3000")
	if err != nil {
		log.Panicln(err)
	}
}

// CORSMiddleware CORS middleware
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// getBlockchainHandler retrieves a chain of available blocks
func (bs *blockchainServer) getBlockchainHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, bs.store.GetBlockchain())
}

// mineHandler mines a hash for the block
func (bs *blockchainServer) mineHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	var postData blockchainStore.Block
	err := c.BindJSON(&postData)
	if err != nil {
		log.Panicln(err)
	}
	c.JSON(http.StatusOK, bs.store.MineBlock(postData))
}
