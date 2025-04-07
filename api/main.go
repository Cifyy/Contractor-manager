package main

import (
	"context"
	"expansApi/api"
	"expansApi/api/controllers"
	"expansApi/api/middlewares"
	"expansApi/pg"
	"log"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

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

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	port, err := strconv.ParseUint(os.Getenv("DATABASE_Port"), 10, 16)
	if err != nil {
		log.Fatal("port must be an integer")
	}
	db, err := pg.NewPG(context.Background(), os.Getenv("DATABASE_Host"), uint16(port), os.Getenv("DATABASE_User"), os.Getenv("DATABASE_Password"), os.Getenv("DATABASE_Database"))
	if err != nil {
		log.Fatal("failed connecting to database")
	}

	router := gin.Default()

	router.Use(CORSMiddleware())
	GroupAuth := router.Group("auth")
	{
		GroupAuth.POST("/signup", controllers.CreateUser)
		GroupAuth.POST("/login", controllers.Login)
	}

	GroupApi := router.Group("api", middlewares.CheckAuth)
	{
		GroupApi.POST("/contract", api.AddFullContract)
		GroupApi.GET("/customerTiles", api.GetCustomerTiles)
		GroupApi.POST("/customerInfo", api.GetCustomerInfo)
		GroupApi.POST("/employee", api.AddCustomerEmployee)
		GroupApi.POST("/employeeInfo", api.SetCustomerAdditionalInfo)
		GroupApi.GET("/customerContracts", api.GetCustomerContracts)
		GroupApi.GET("/contractTiles", api.GetContractTiles)
		GroupApi.POST("/addCustomer", api.AddCustomer)
		GroupApi.GET("/checkToken", middlewares.CheckToken)
		GroupApi.GET("/contracts", db.GetContracts)
		GroupApi.GET("/products", api.GetProducts)
		GroupApi.GET("/customers", db.GetCustomers)
		GroupApi.POST("/stock", api.SetProductStock)
	}

	// router.GET("/contracts", GetContracts(db))

	// router.Run("localhost:8090")
	router.Run("0.0.0.0:8090")

	// router.RunTLS(":8080", "server.pem", "server.key")

}
