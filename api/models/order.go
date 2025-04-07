package models

import "time"

type OrderTile struct {
	Id            string    `json:"id"`
	CustomerName  string    `json:"customer_name"`
	ReferenceName *string   `json:"reference_name"`
	ContractName  *string   `json:"contract_name"`
	Value         string    `json:"value"`
	Date          time.Time `json:"date"`
	Fulfilled     bool      `json:"fulfilled"`
}
type CustomerContractList struct {
	Name      string             `json:"name"`
	Nip       string             `json:"nip"`
	Contracts []CustomerContract `json:"contracts"`
}
type CustomerContract struct {
	ReferenceName string             `json:"reference_name"`
	StartDate     time.Time          `json:"start_date"`
	EndDate       time.Time          `json:"end_date"`
	Products      []ContractItemName `json:"products"`
}

type ContractItemName struct {
	Name   string  `json:"name"`
	Price  float64 `json:"price"`
	Amount uint    `json:"amount"`
	Tax    uint    `json:"tax"`
}
