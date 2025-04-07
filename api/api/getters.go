package api

import (
	"expansApi/pg"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	products, err := pg.PgInstance.GetRawProducts(c)
	if err != nil {
		log.Fatal("Failed quering contracts: %w", err)
	}
	c.IndentedJSON(http.StatusOK, products)
}

func GetCustomerTiles(c *gin.Context) {
	tiles, err := pg.PgInstance.GetRawCustomerTiles(c)
	if err != nil {
		log.Fatal("Failed quering customer tiles: %w", err)
	}
	c.IndentedJSON(http.StatusOK, tiles)
}

func GetContractTiles(c *gin.Context) {
	tiles, err := pg.PgInstance.GetRawContractTiles(c)
	if err != nil {
		log.Fatal("Failed quering customer tiles: %w", err)
	}
	c.IndentedJSON(http.StatusOK, tiles)
}

func GetOrderTiles(c *gin.Context) {
	tiles, err := pg.PgInstance.GetRawOrderTiles(c)
	if err != nil {
		log.Fatal("Failed quering order tiles: %w", err)
	}
	c.IndentedJSON(http.StatusOK, tiles)
}
func GetCustomerContracts(c *gin.Context) {
	tiles, err := pg.PgInstance.GetRawCustomerContracts(c)
	if err != nil {
		log.Fatal("Failed quering order tiles: %w", err)
	}
	c.IndentedJSON(http.StatusOK, tiles)
}

type Nip struct {
	Nip string `json:"nip"`
}

func GetCustomerInfo(c *gin.Context) {
	var content Nip
	if err := c.ShouldBindJSON(&content); err != nil {
		c.Error(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	if content.Nip == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "NIP is required"})
		return
	}

	// fmt.Println("NIP:", content.Nip)

	customerInfo, err := pg.PgInstance.GetRawCustomerInfo(c, content.Nip)
	if err != nil {
		log.Printf("Failed querying customer info: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve customer info"})
		return
	}

	c.IndentedJSON(http.StatusOK, customerInfo)
}
