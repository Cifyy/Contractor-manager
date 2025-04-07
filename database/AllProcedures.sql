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
CREATE OR REPLACE PROCEDURE addContractItem (
    in_contract_reference_name varchar(31),
    in_product_name varchar(255),
    in_amount INT,
    in_price float,
    in_tax INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_contract_id INT;
    v_product_id INT;
BEGIN
    SELECT id INTO v_contract_id FROM contract WHERE reference_name = in_contract_reference_name LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent contract --> %', in_contract_reference_name;
    END IF;

    SELECT id INTO v_product_id FROM product WHERE "name" = in_product_name LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nonexistent product name --> %', in_product_name;
    END IF;

    INSERT INTO contract_item (product_id, contract_id, price, amount, tax)
    VALUES (v_product_id, v_contract_id, in_price::NUMERIC::MONEY, in_amount, in_tax);

END;
$$;

-- CALL addContractItem('SIEMA','1EPP099',100,0.78,23);
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
