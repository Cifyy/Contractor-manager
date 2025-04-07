CREATE OR REPLACE PROCEDURE addInvoice(
    in_order_id INT,
    in_nip varchar(15),
    in_creation_date DATE,
    in_days_until_due INT,
    in_paid BOOLEAN DEFAULT FALSE
)LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM * FROM "order" WHERE id = in_order_id LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent order_id --> %', in_order_id;
    END IF;

    INSERT INTO invoice (order_id, nip, creation_date, days_until_due, paid)
    VALUES (in_order_id, in_nip,in_creation_date, in_days_until_due,in_paid);

END;
$$;
