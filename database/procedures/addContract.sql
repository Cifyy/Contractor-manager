CREATE OR REPLACE PROCEDURE addContract(
    in_reference_name varchar(31),
    in_nip varchar(15),
    in_start_date date,
    in_end_date date
)
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM * FROM customer WHERE nip = in_nip LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent nip --> %', in_nip;
    END IF;

    INSERT INTO contract (reference_name, nip, start_date, end_date) VALUES(in_reference_name,in_nip,in_start_date,in_end_date);

END;
$$;

-- CALL addContract('SIEMA','123-32-32-123','2019-12-31','2019-12-31');