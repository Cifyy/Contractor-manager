CREATE OR REPLACE PROCEDURE addCustomer(
    in_nip varchar(15),
    in_name varchar(255),
    in_customer_type varchar(31),
    in_pneumatic_post BOOLEAN,
    in_additional_info varchar(8191)
)
    LANGUAGE plpgsql
AS $$
DECLARE
    v_customer_nip varchar(15);
BEGIN
    PERFORM * FROM customer WHERE nip = in_nip LIMIT 1;
    IF FOUND THEN
        RAISE EXCEPTION 'Customer with nip: % already exists', in_nip;
    END IF;

    INSERT INTO customer (nip,name,customer_type,additional_info,pneumatic_post) VALUES(in_nip, in_name, in_customer_type, in_additional_info, in_pneumatic_post) RETURNING nip INTO v_customer_nip;
    RAISE NOTICE 'Customer added with nip: %', v_customer_nip;
END;
$$;

-- CALL addHospital('646-54-32-543', 'Szpital Specjalstyczny imienia Koksanamala');