package pg

import (
	"context"
	"expansApi/models"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func (pg *postgres) GetRawCustomers(ctx context.Context) ([]models.Customer, error) {
	query := `SELECT * FROM customer`

	rows, err := pg.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("unable to query customers: %v", err)
	}
	defer rows.Close()
	return pgx.CollectRows(rows, pgx.RowToStructByName[models.Customer])
}

func (pg *postgres) GetRawCustomerTiles(ctx context.Context) ([]models.CustomerTile, error) {
	query := `
		SELECT customer.nip, customer.name, customer.customer_type, address.city, address.province, customer.pneumatic_post,
			SUM(round(((contract_item.amount*contract_item.price)*(1+(contract_item.tax/100.0)))::decimal,2)) as contracts_value,
				SUM(round(((order_item.amount*order_item.price)*(1+(order_item.tax/100.0)))::decimal,2)) as contracts_utilization_value
		FROM customer
			LEFT JOIN (
			SELECT DISTINCT nip,city,province.name as province FROM customer_address JOIN province ON customer_address.province_id = province.id
			) as address ON customer.nip = address.nip
			LEFT JOIN contract ON customer.nip = contract.nip
			LEFT JOIN contract_order ON contract_order.contract_id = contract.id
			LEFT JOIN "order" ON "order".id = contract_order.order_id
			LEFT JOIN order_item ON order_item.order_id = "order".id
			LEFT JOIN contract_item ON contract.id = contract_item.contract_id
			GROUP BY customer.nip, address.city,address.province
	`

	rows, err := pg.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("unable to query customers tiles: %w", err)
	}
	defer rows.Close()
	return pgx.CollectRows(rows, pgx.RowToStructByName[models.CustomerTile])
}

func (pg *postgres) GetRawContractTiles(ctx context.Context) ([]models.ContractTile, error) {
	query := `SELECT contract.id, contract.reference_name, contract.nip, contract.start_date, contract.end_date, customer.name as customer_name,
				SUM(round(((contract_item.amount*contract_item.price)*(1+(contract_item.tax/100.0)))::decimal,2)) as contract_value,
				SUM(round(((order_item.amount*order_item.price)*(1+(order_item.tax/100.0)))::decimal,2)) as contract_utilization_value
				FROM contract
					JOIN customer ON contract.nip = customer.nip
					LEFT JOIN contract_order ON contract_order.contract_id = contract.id
					LEFT JOIN "order" ON "order".id = contract_order.order_id
					LEFT JOIN order_item ON order_item.order_id = "order".id
					LEFT JOIN contract_item ON contract.id = contract_item.contract_id
				GROUP BY contract.id, customer.name ;`

	rows, err := pg.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("unable to query contract tiles: %w", err)
	}
	defer rows.Close()
	return pgx.CollectRows(rows, pgx.RowToStructByName[models.ContractTile])
}

func (pg *postgres) GetRawContracts(ctx context.Context) ([]models.Contract, error) {
	query := `SELECT id,reference_name,contract.nip,start_date,end_date,name as customer_name FROM contract JOIN customer ON contract.nip = customer.nip`

	rows, err := pg.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("unable to query contracts: %w", err)
	}
	defer rows.Close()
	return pgx.CollectRows(rows, pgx.RowToStructByName[models.Contract])

}

func (pg *postgres) GetRawProducts(ctx context.Context) ([]models.Product, error) {
	query := `SELECT * FROM product`

	rows, err := pg.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("unable to query products: %w", err)
	}
	defer rows.Close()
	return pgx.CollectRows(rows, pgx.RowToStructByName[models.Product])

}
func (pg *postgres) GetRawOrderTiles(ctx context.Context) ([]models.OrderTile, error) {
	query := `SELECT "order".id,"order".order_date, "order".reference_name, "order".fulfilled, contract.reference_name,
				SUM(round(((order_item.amount*order_item.price)*(1+(order_item.tax/100.0)))::decimal,2)) as value
				FROM "order"
					LEFT JOIN order_item ON "order".id = order_item.id
					LEFT JOIN contract_order ON "order".id = contract_order.order_id
					LEFT JOIN contract ON contract_order.contract_id = contract.id
					GROUP BY "order".id, contract.reference_name;`

	rows, err := pg.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("unable to query order tiles: %w", err)
	}
	defer rows.Close()
	return pgx.CollectRows(rows, pgx.RowToStructByName[models.OrderTile])
}

func (pg *postgres) GetRawCustomerContracts(ctx context.Context) ([]models.CustomerContractList, error) {
	query := `WITH product_data AS (
    SELECT contract_item.contract_id AS contract_id,
           json_agg(json_build_object(
                   'name', product.name,
                   'price', contract_item.price::numeric,
                   'amount', contract_item.amount,
                   'tax', contract_item.tax
                    )) AS products
    FROM contract_item
             JOIN product ON contract_item.product_id = product.id
    GROUP BY contract_item.contract_id
)
SELECT customer.name,
       customer.nip,
       json_agg(json_build_object(
               'reference_name', contract.reference_name,
               'start_date', to_char(contract.start_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
               'end_date', to_char(contract.end_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
               'products', COALESCE(product_data.products, '[]'::json) 
                )) AS contracts
FROM customer
         JOIN contract ON customer.nip = contract.nip
         LEFT JOIN product_data ON contract.id = product_data.contract_id 
GROUP BY customer.name, customer.nip;`

	rows, err := pg.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("unable to query order tiles: %w", err)
	}
	defer rows.Close()
	return pgx.CollectRows(rows, pgx.RowToStructByName[models.CustomerContractList])
}
func (pg *postgres) GetRawCustomerInfo(ctx context.Context, nip string) (models.CustomerInfo, error) {
	query := `WITH product_data AS (
    SELECT contract_item.contract_id AS contract_id,
           json_agg(json_build_object(
                   'name', product.name,
                   'price', contract_item.price::numeric,
                   'amount', contract_item.amount,
                   'tax', contract_item.tax
                    )) AS products
    FROM contract_item
             JOIN product ON contract_item.product_id = product.id
    GROUP BY contract_item.contract_id
),
     customer_address AS(
         SELECT customer.nip, JSON_AGG(
                 to_jsonb(
                         jsonb_build_object(
                                 'country', country.name,
                                 'city', city,
                                 'province', province.name,
                                 'post_code', post_code,
                                 'street', street,
                                 'street2', street2
                         )
                 )
                              ) as address FROM
             customer JOIN customer_address ON customer.nip = customer_address.nip
                      JOIN province ON customer_address.province_id = province.id
                      JOIN country ON customer_address.country_id = country.id
         GROUP BY customer.nip
     )
        , contract_data AS (
    SELECT contract.id, contract.reference_name, contract.nip,
           to_char(contract.start_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as start_date,
           to_char(contract.end_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as end_date,
           customer.nip as customer_nip ,
           SUM(round(((contract_item.amount*contract_item.price)*(1+(contract_item.tax/100.0)))::decimal,2)) as contract_value,
           SUM(round(((order_item.amount*order_item.price)*(1+(order_item.tax/100.0)))::decimal,2)) as contract_utilization_value
 FROM contract
          JOIN customer ON contract.nip = customer.nip
          LEFT JOIN contract_order ON contract_order.contract_id = contract.id
          LEFT JOIN "order" ON "order".id = contract_order.order_id
          LEFT JOIN order_item ON order_item.order_id = "order".id
          LEFT JOIN contract_item ON contract.id = contract_item.contract_id
 GROUP BY contract.id, customer.nip

),contract_tran AS (
     SELECT contract_data.*, product_data.products as products
     FROM contract_data LEFT JOIN product_data ON contract_data.id = product_data.contract_id
)
,contract_con_data AS (
     SELECT customer_nip AS nip,JSON_AGG(contract_tran) AS contracts
     FROM contract_tran
     GROUP BY customer_nip
)
,employee_data AS (
      SELECT customer.nip, JSON_AGG(to_json(employee)) AS employees
      FROM customer
      JOIN employee ON employee.nip = customer.nip
      GROUP BY customer.nip
  ),
 customer_contract_values AS(
     SELECT customer.nip,
            SUM(round(((contract_item.amount*contract_item.price)*(1+(contract_item.tax/100.0)))::decimal,2)) as contracts_value,
            SUM(round(((order_item.amount*order_item.price)*(1+(order_item.tax/100.0)))::decimal,2)) as contracts_utilization_value
     FROM customer
              LEFT JOIN contract ON customer.nip = contract.nip
              LEFT JOIN contract_order ON contract_order.contract_id = contract.id
              LEFT JOIN "order" ON "order".id = contract_order.order_id
              LEFT JOIN order_item ON order_item.order_id = "order".id
              LEFT JOIN contract_item ON contract.id = contract_item.contract_id
     GROUP BY customer.nip
 )
SELECT customer.nip, customer.name, customer.customer_type, customer.pneumatic_post, customer.additional_info,
       customer_contract_values.contracts_value as contracts_value,
       customer_contract_values.contracts_utilization_value as contracts_utilization_value,
       employee_data.employees as employees,
       customer_address.address as addresses,
       contract_con_data.contracts as contracts

FROM customer
      LEFT JOIN customer_contract_values ON customer.nip = customer_contract_values.nip
      LEFT JOIN employee_data ON customer.nip = employee_data.nip
      LEFT JOIN contract_con_data ON customer.nip = contract_con_data.nip
      LEFT JOIN customer_address ON customer.nip = customer_address.nip
WHERE customer.nip = $1;
`

	row, err := pg.DB.Query(ctx, query, nip)
	if err != nil {
		return models.CustomerInfo{}, fmt.Errorf("unable to query customer info: %w", err)
	}
	defer row.Close()
	return pgx.CollectExactlyOneRow(row, pgx.RowToStructByName[models.CustomerInfo])
}
