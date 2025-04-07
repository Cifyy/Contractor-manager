package api

import (
	"expansApi/models"
	"expansApi/pg"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddFullContract(c *gin.Context) {
	var content models.FullContract
	if err := c.ShouldBindJSON(&content); err != nil {
		c.Error(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	err := pg.PgInstance.AddFullContract(c, content)

	if err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusBadRequest, err.Error())
		return
	}
	GetContractTiles(c)
}

func AddCustomerEmployee(c *gin.Context) {
	var content models.AddEmployee
	if err := c.ShouldBindJSON(&content); err != nil {
		c.Error(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	err := pg.PgInstance.AddEmployee(c, content)

	if err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusBadRequest, err.Error())
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

// func AddContract(c *gin.Context) {
// 	var content models.Contract
// 	if err := c.ShouldBindJSON(&content); err != nil {
// 		c.Error(err)
// 		c.AbortWithStatus(http.StatusBadRequest)
// 		return
// 	}
// 	err := pg.PgInstance.AddContract(c, content)

// 	if err != nil {
// 		fmt.Println(err)
// 		c.IndentedJSON(http.StatusBadRequest, err.Error())
// 		return
// 	}
// 	GetContractTiles(c)

// }
// func AddContractItem(c *gin.Context) {
// 	var content models.ContractItem
// 	if err := c.ShouldBindJSON(&content); err != nil {
// 		c.Error(err)
// 		c.AbortWithStatus(http.StatusBadRequest)
// 		return
// 	}
// 	err := pg.PgInstance.AddContractItem(c, content)

//		if err != nil {
//			fmt.Println(err)
//			c.IndentedJSON(http.StatusBadRequest, err.Error())
//			return
//		}
//		c.Status(http.StatusOK)
//	}
func AddCustomer(c *gin.Context) {

	var content models.AddCustomer
	if err := c.ShouldBindJSON(&content); err != nil {
		c.Error(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	// err := pg.PgInstance.Add(c, content)
	// fmt.Println(content)

	customer := models.Customer{
		Nip:            content.Nip,
		Name:           content.Name,
		CustomerType:   content.CustomerType,
		PneumaticPost:  content.PneumaticPost,
		AdditionalInfo: nil,
	}
	if content.AdditionalInfo != nil {
		customer.AdditionalInfo = content.AdditionalInfo
	}
	// fmt.Println(customer)
	err := pg.PgInstance.AddCustomer(c, customer)

	if err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusBadRequest, err.Error())
		return
	}
	fmt.Print(content.WithAddress)
	if content.WithAddress != nil {
		address := models.CustomerAddress{
			Nip:      content.Nip,
			Country:  content.Country,
			Province: content.Province,
			City:     content.City,
			Street:   content.Street,
			Street2:  content.Street2,
			Postcode: content.Postcode,
		}
		err = pg.PgInstance.AddAddress(c, address)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, err.Error())
			return
		}
	}

	GetCustomerTiles(c)
	// fmt.Println(content.WithAddress)
	// if err := pg.PgInstance.SetStock(c, content); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "failed to change stock"})
	// 	return
	// }
	// GetProducts(c)
	// c.Status(http.StatusOK)
}
