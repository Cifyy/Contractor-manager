package models

import (
	"time"
)

type AddCustomer struct {
	Name           string  `json:"name" binding:"required"`
	Nip            string  `json:"nip" binding:"required"`
	CustomerType   string  `json:"customer_type" binding:"required"`
	WithAddress    *bool   `json:"with_address"`
	PneumaticPost  *bool   `json:"pneumatic_post"`
	Country        *string `json:"country"`
	City           *string `json:"city" `
	Province       *string `json:"province"`
	Postcode       *string `json:"post_code"`
	Street         *string `json:"street"`
	Street2        *string `json:"street2"`
	AdditionalInfo *string `json:"additional_info"`
}

type CustomerAddress struct {
	Nip      string  `json:"nip" binding:"required"`
	Country  *string `json:"country"`
	City     *string `json:"city" `
	Province *string `json:"province"`
	Postcode *string `json:"post_code"`
	Street   *string `json:"street"`
	Street2  *string `json:"street2"`
}

type FullContract struct {
	CustomerName  string         `json:"customer_name"`
	ReferenceName string         `json:"reference_name"`
	Nip           string         `json:"nip"`
	StartDate     time.Time      `json:"start_date"`
	EndDate       time.Time      `json:"end_date"`
	Products      []ContractItem `json:"products"`
}
type CustomerTile struct {
	Nip                       string   `json:"nip"`
	Name                      string   `json:"name"`
	CustomerType              string   `json:"customer_type"`
	PneumaticPost             *bool    `json:"pneumatic_post"`
	City                      *string  `json:"city"`
	Province                  *string  `json:"province"`
	ContractsValue            *float64 `json:"contracts_value"`
	ContractsUtilizationValue *float64 `json:"contracts_utilization_value"`
}

type ContractTile struct {
	Id                       uint      `json:"id"`
	Nip                      string    `json:"nip"`
	ReferenceName            string    `json:"reference_name"`
	CustomerName             string    `json:"customer_name"`
	StartDate                time.Time `json:"start_date"`
	EndDate                  time.Time `json:"end_date"`
	ContractValue            *float64  `json:"contract_value"`
	ContractUtilizationValue *float64  `json:"contract_utilization_value"`
}

type Customer struct {
	Nip            string  `json:"nip"`
	Name           string  `json:"name"`
	CustomerType   string  `json:"customer_type"`
	AdditionalInfo *string `json:"additional_info"`
	PneumaticPost  *bool   `json:"pneumatic_post"`
}

type Contract struct {
	Id            *string   `json:"id"`
	CustomerName  string    `json:"customer_name"`
	ReferenceName string    `json:"reference_name"`
	Nip           string    `json:"nip"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
}
type ContractItem struct {
	ContractReferenceName string  `json:"contract_reference_name"`
	ProductName           string  `json:"product_name"`
	Amount                uint    `json:"amount"`
	Price                 float64 `json:"price"`
	Tax                   uint    `json:"tax"`
}

type Product struct {
	Id       uint   `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
	Stock    uint   `json:"stock"`
}

type User struct {
	ID       uint   `json:"id" gorm:"primary_key"`
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
}

type AuthInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type CustomerInfo struct {
	Nip                       string                  `json:"nip"`
	Name                      string                  `json:"name"`
	CustomerType              string                  `json:"customer_type"`
	PneumaticPost             *bool                   `json:"pneumatic_post"`
	ContractsValue            *float64                `json:"contracts_value"`
	ContractsUtilizationValue *float64                `json:"contracts_utilization_value"`
	AdditionalInfo            *string                 `json:"additional_info"`
	Addresses                 *[]CustomerAddress      `json:"addresses"`
	Contracts                 *[]CustomerContractInfo `json:"contracts"`
	Employees                 *[]Employee             `json:"employees"`
}
type SetCustomerAdditionalInfo struct {
	Nip            string `json:"nip"`
	AdditionalInfo string `json:"additional_info"`
}

type Employee struct {
	Id      uint    `json:"id"`
	Name    string  `json:"name"`
	Surname string  `json:"surname"`
	Email   *string `json:"email"`
	Phone   *string `json:"phone"`
	Role    *string `json:"role"`
}
type AddEmployee struct {
	Nip     string  `json:"nip"`
	Name    string  `json:"name"`
	Surname string  `json:"surname"`
	Email   *string `json:"email"`
	Phone   *string `json:"phone"`
	Role    *string `json:"role"`
}

type CustomerContractInfo struct {
	ReferenceName    string             `json:"reference_name"`
	StartDate        time.Time          `json:"start_date"`
	EndDate          time.Time          `json:"end_date"`
	Products         []ContractItemName `json:"products"`
	Value            *float64           `json:"contract_value"`
	UtilizationValue *float64           `json:"contract_utilization_value"`
}
