CREATE OR REPLACE PROCEDURE addCustomerAddress(
    in_nip varchar(15),
    in_country_name varchar(63),
    in_province_name varchar(63),
    in_city varchar(63),
    in_street varchar(63),
    in_post_code varchar(15),
    in_street2 varchar(63) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_country_id INT;
    v_province_id INT;
BEGIN

    PERFORM * FROM customer WHERE nip = in_nip LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent nip --> %', in_nip;
    END IF;

    SELECT id INTO v_country_id FROM country WHERE name = in_country_name LIMIT 1;
    IF NOT FOUND THEN
        INSERT INTO country(name)
        VALUES (in_country_name)
        RETURNING id INTO v_country_id;
    END IF;

    SELECT id INTO v_province_id  FROM province WHERE name = in_province_name LIMIT 1;
    IF NOT FOUND THEN
        INSERT INTO province(name)
        VALUES (in_province_name)
        RETURNING id INTO v_province_id ;
    END IF;


    INSERT INTO customer_address(nip, country_id, province_id, city, street, street2, post_code)
    VALUES (in_nip,v_country_id, v_province_id, in_city, in_street, in_street2, in_post_code);

END;
$$;

-- CALL addHospitalAddress('432-12-52-735','Polska','Lubuskie','Rzeszów','ul.siema','90-321');
