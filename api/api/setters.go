package api

import (
	"expansApi/models"
	"expansApi/pg"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetProductStock(c *gin.Context) {

	var content models.SetStock
	if err := c.ShouldBindJSON(&content); err != nil {
		c.Error(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err := pg.PgInstance.SetStock(c, content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to change stock"})
		return
	}
	GetProducts(c)
	// c.Status(http.StatusOK)
}

func SetCustomerAdditionalInfo(c *gin.Context) {

	var content models.SetCustomerAdditionalInfo
	if err := c.ShouldBindJSON(&content); err != nil {
		c.Error(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err := pg.PgInstance.SetCustomerInfo(c, content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to change customer info"})
		return
	}

	//getCustomerInfo but without getting nip from body
	customerInfo, err := pg.PgInstance.GetRawCustomerInfo(c, content.Nip)
	if err != nil {
		log.Printf("Failed querying customer info: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve customer info"})
		return
	}
	c.IndentedJSON(http.StatusOK, customerInfo)
}
