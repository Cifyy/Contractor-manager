package pg

import (
	"context"
	"expansApi/models"
	"fmt"
)

func (pg *postgres) AddCustomer(ctx context.Context, customer models.Customer) error {
	query := "CALL addCustomer($1,$2,$3,$4,$5)"

	_, err := pg.DB.Exec(ctx, query, customer.Nip, customer.Name, customer.CustomerType, customer.PneumaticPost, customer.AdditionalInfo)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func (pg *postgres) AddAddress(ctx context.Context, address models.CustomerAddress) error {
	query := "CALL addCustomerAddress($1,$2,$3,$4,$5,$6,$7)"
	fmt.Println(address)
	_, err := pg.DB.Exec(ctx, query, address.Nip, address.Country, address.Province, address.City, address.Street, address.Postcode, address.Street2)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
func (pg *postgres) AddEmployee(ctx context.Context, employee models.AddEmployee) error {
	query := "CALL addCustomerEmployee($1,$2,$3,$4,$5,$6)"
	// fmt.Println(address)
	_, err := pg.DB.Exec(ctx, query, employee.Nip, employee.Name, employee.Surname, employee.Role, employee.Phone, employee.Email)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

// func (pg *postgres) AddContract(ctx context.Context, contract models.Contract) error {
// 	query := "CALL addContract($1,$2,$3,$4)"
// 	_, err := pg.DB.Exec(ctx, query, contract.ReferenceName, contract.Nip, contract.StartDate, contract.EndDate)
// 	if err != nil {
// 		fmt.Println(err)
// 		return err
// 	}
// 	return nil
// }

func (pg *postgres) AddFullContract(ctx context.Context, contract models.FullContract) error {
	contractQuery := "CALL addContract($1,$2,$3,$4)"

	_, err := pg.DB.Exec(ctx, contractQuery, contract.ReferenceName, contract.Nip, contract.StartDate, contract.EndDate)
	if err != nil {
		fmt.Println(err)
		return err
	}
	productQuery := "CALL addContractItem($1,$2,$3,$4,$5)"
	for _, product := range contract.Products {
		_, err = pg.DB.Exec(ctx, productQuery, contract.ReferenceName, product.ProductName, product.Amount, product.Price, product.Tax)
	}
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

// func (pg *postgres) AddContractItem(ctx context.Context, item models.ContractItem) error {
// 	query := "CALL addContractItem($1,$2,$3,$4,$5)"
// 	_, err := pg.DB.Exec(ctx, query, item.ContractReferenceName, item.ProductName, item.Amount, item.Price, item.Tax)
// 	if err != nil {
// 		fmt.Println(err)
// 		return err
// 	}
// 	return nil
// }
