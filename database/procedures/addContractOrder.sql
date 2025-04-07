CREATE OR REPLACE FUNCTION addContractOrder (
    in_contract_reference_name varchar(31),
    in_order_date date,
    in_sell_date date,
    in_creation_date date,
    in_nip varchar(15),
    in_days_until_due INT,
    in_reference_name varchar(31) DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_contract_id INT;
    v_order_id INT;
BEGIN
    SELECT id INTO v_contract_id FROM contract WHERE reference_name = in_contract_reference_name LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent contract --> %', in_contract_reference_name;
    END IF;

    INSERT INTO "order" (order_date, sell_date, reference_name)
    VALUES (in_order_date,in_sell_date,in_reference_name)
    RETURNING id INTO v_order_id;

    CALL addinvoice(v_order_id, in_nip,in_creation_date, in_days_until_due);

    INSERT INTO contract_order (order_id, contract_id)
    VALUES (v_order_id,v_contract_id);

    RETURN v_order_id;
END;
$$;

-- SELECT addContractOrder('Contractor', '2025-02-13', '2025-03-01', '2025-02-13', '1234567890', 30);
