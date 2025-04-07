CREATE OR REPLACE PROCEDURE addOrderItem(
    in_order_id INT,
    in_product_name varchar(127),
    in_amount INT,
    in_tax INT,
    in_price float
)
    LANGUAGE plpgsql
AS $$
DECLARE
    v_product_id INT;
BEGIN
    SELECT id INTO v_product_id FROM product WHERE name = in_product_name LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent product --> %', in_product_name;
    END IF;

    INSERT INTO order_item (order_id, product_id, amount, tax, price)
    VALUES(in_order_id,v_product_id,in_amount,in_tax,in_price::NUMERIC::MONEY);

END;
$$;

-- CALL addOrderItem(1,'1EPP099',1000,23,0.32);