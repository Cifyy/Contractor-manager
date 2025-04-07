package pg

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (db *postgres) GetContracts(c *gin.Context) {
	contracts, err := db.GetRawContracts(c)
	if err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusBadRequest, err)
	}
	c.IndentedJSON(http.StatusOK, contracts)
}

func (db *postgres) GetCustomers(c *gin.Context) {
	customers, err := db.GetRawCustomers(c)
	if err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusBadRequest, err)
		// log.Fatal("Failed quering customers")
	}
	c.IndentedJSON(http.StatusOK, customers)
}
