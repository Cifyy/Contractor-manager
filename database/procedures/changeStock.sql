CREATE OR REPLACE PROCEDURE changeStock (
    in_product_name varchar(255),
    in_amount INT
)
    LANGUAGE plpgsql
AS $$
DECLARE
    v_product_id INT;
BEGIN

    SELECT id INTO v_product_id FROM product WHERE "name" = in_product_name LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent product name --> %', in_product_name;
    END IF;

    UPDATE product SET stock = stock + in_amount WHERE id = v_product_id;
END;
$$;