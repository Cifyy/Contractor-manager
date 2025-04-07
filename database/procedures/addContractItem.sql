CREATE OR REPLACE PROCEDURE addContractItem (
    in_contract_reference_name varchar(31),
    in_product_name varchar(255),
    in_amount INT,
    in_price float,
    in_tax INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_contract_id INT;
    v_product_id INT;
BEGIN
    SELECT id INTO v_contract_id FROM contract WHERE reference_name = in_contract_reference_name LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent contract --> %', in_contract_reference_name;
    END IF;

    SELECT id INTO v_product_id FROM product WHERE "name" = in_product_name LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent product name --> %', in_product_name;
    END IF;

    INSERT INTO contract_item (product_id, contract_id, price, amount, tax)
    VALUES (v_product_id, v_contract_id, in_price::NUMERIC::MONEY, in_amount, in_tax);

END;
$$;

-- CALL addContractItem('SIEMA','1EPP099',100,0.78,23);