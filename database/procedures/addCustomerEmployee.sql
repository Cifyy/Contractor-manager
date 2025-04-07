CREATE OR REPLACE PROCEDURE addCustomerEmployee(
    in_nip varchar(15),
    in_name varchar(63),
    in_surname varchar(63),
    in_role varchar(63) DEFAULT NULL,
    in_phone varchar(15) DEFAULT NULL,
    in_email varchar(63) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN

    PERFORM * FROM customer WHERE nip = in_nip LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent nip --> %', in_nip;
    END IF;

    INSERT INTO employee(nip, "name", surname, "role", phone, email)
    VALUES (in_nip, in_name,in_surname, in_role, in_phone, in_email);

END;
$$;

-- CALL addHospitalAddress('432-12-52-735','Polska','Lubuskie','Rzeszów','ul.siema','90-321');
