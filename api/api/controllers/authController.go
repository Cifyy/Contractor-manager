package controllers

import (
	"expansApi/models"
	"expansApi/pg"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(c *gin.Context) {

	var authInput models.AuthInput

	if err := c.ShouldBindJSON(&authInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var exists bool
	query := `SELECT exists(select 1 FROM "user" WHERE username = $1)`
	fetchErr := pg.PgInstance.DB.QueryRow(c, query, authInput.Username).Scan(&exists)
	if fetchErr != nil {
		log.Fatal(fetchErr)
	}
	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username already used"})
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(authInput.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		Username: authInput.Username,
		Password: string(passwordHash),
	}
	fmt.Println(user)

	_, err = pg.PgInstance.DB.Exec(c, "INSERT INTO \"user\" (username,password) VALUES ($1,$2)", user.Username, user.Password)

	if err != nil {
		log.Fatal("failed inserting user: ", err)
	}

	c.JSON(http.StatusOK, gin.H{"data": user})

}

func Login(c *gin.Context) {

	var authInput models.AuthInput

	if err := c.ShouldBindJSON(&authInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `SELECT id, username, password FROM "user" WHERE username = $1 LIMIT 1`

	var user models.User

	err := pg.PgInstance.DB.QueryRow(c, query, authInput.Username).Scan(&user.ID, &user.Username, &user.Password)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
			return
		}
		log.Fatal("error finding user")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(authInput.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid password"})
		return
	}

	generateToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  user.ID,
		"exp": time.Now().Add(time.Hour * 1).Unix(),
	})

	token, err := generateToken.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to generate token"})
	}

	c.JSON(200, gin.H{
		"token": token,
	})
}
