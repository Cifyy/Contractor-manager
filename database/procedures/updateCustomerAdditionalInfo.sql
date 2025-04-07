CREATE OR REPLACE PROCEDURE updateCustomerAdditionalInfo (
    in_nip varchar(255),
    in_additional_info varchar(8191)
)
    LANGUAGE plpgsql
AS $$
BEGIN

    PERFORM * FROM customer WHERE nip = in_nip LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent nip --> %', in_nip;
    END IF;

    UPDATE customer SET additional_info = in_additional_info WHERE nip = in_nip;
END;
$$;