CREATE OR REPLACE FUNCTION addOrder (
    in_order_date date,
    in_sell_date date,
    in_invoice_creation_date date,
    in_nip varchar(15),
    in_days_until_due INT,
    in_reference_name varchar(31) DEFAULT NULL,
    in_fulfilled boolean DEFAULT false,
    in_shipment_type varchar(63) DEFAULT 'Shipment'
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id INT;
BEGIN

    INSERT INTO "order" (order_date, sell_date, reference_name)
    VALUES (in_order_date,in_sell_date,in_reference_name)
    RETURNING id INTO v_order_id;

    CALL addinvoice(v_order_id, in_nip, in_invoice_creation_date, in_days_until_due);

    INSERT INTO order (order_date, sell_date,reference_name,fulfilled,shipment_type)
    VALUES (in_order_date,in_sell_date,in_reference_name,in_fulfilled,in_shipment_type);

    RETURN v_order_id;
END;
$$;

-- SELECT addContractOrder('Contractor', '2025-02-13', '2025-03-01', '2025-02-13', '1234567890', 30);
