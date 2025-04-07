package pg

import (
	"context"
	"expansApi/models"
	"fmt"
)

func (pg *postgres) SetStock(ctx context.Context, content models.SetStock) error {
	query := `CALL changeStock($1,$2::integer)`

	_, err := pg.DB.Exec(ctx, query, content.Name, content.Change)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("unable to change stock: %w", err)
	}
	return nil
}

func (pg *postgres) SetCustomerInfo(ctx context.Context, content models.SetCustomerAdditionalInfo) error {
	query := `CALL updateCustomerAdditionalInfo($1,$2)`

	_, err := pg.DB.Exec(ctx, query, content.Nip, content.AdditionalInfo)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("unable to change stock: %w", err)
	}
	return nil
}
