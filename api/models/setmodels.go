package models

type SetStock struct {
	Name   string `json:"name" binding:"required"`
	Change int    `json:"change" binding:"required"`
}
