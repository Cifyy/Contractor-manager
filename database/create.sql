-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-04-07 15:08:35.383

-- tables
-- Table: carrier_shipment
CREATE TABLE carrier_shipment (
    order_id int  NOT NULL,
    carrier varchar(31)  NOT NULL,
    tracking_number varchar(127)  NOT NULL,
    recipient_name varchar(31)  NOT NULL,
    phone int  NULL,
    mail int  NULL,
    CONSTRAINT carrier_shipment_pk PRIMARY KEY (order_id)
);

CREATE TABLE "user" (
                        id serial NOT NULL,
                        username varchar(63)  NOT NULL,
                        password varchar(127)  NOT NULL
);

-- Table: contract
CREATE TABLE contract (
    id serial  NOT NULL,
    reference_name varchar(31)  NOT NULL,
    nip varchar(15)  NOT NULL,
    start_date date  NOT NULL,
    end_date date  NOT NULL,
    CONSTRAINT contract_pk PRIMARY KEY (id)
);

-- Table: contract_item
CREATE TABLE contract_item (
    id serial  NOT NULL,
    product_id int  NOT NULL,
    contract_id int  NOT NULL,
    price money  NOT NULL,
    amount int  NOT NULL,
    tax int  NOT NULL,
    CONSTRAINT contract_item_pk PRIMARY KEY (id)
);

-- Table: contract_order
CREATE TABLE contract_order (
    order_id int  NOT NULL,
    contract_id int  NULL,
    CONSTRAINT contract_order_pk PRIMARY KEY (order_id)
);

-- Table: country
CREATE TABLE country (
    id serial  NOT NULL,
    name varchar(63)  NOT NULL,
    CONSTRAINT country_pk PRIMARY KEY (id)
);

-- Table: customer
CREATE TABLE customer (
    nip varchar(15)  NOT NULL,
    name varchar(255)  NOT NULL,
    customer_type varchar(31)  NOT NULL,
    additional_info varchar(8191)  NULL,
    CONSTRAINT customer_pk PRIMARY KEY (nip)
);

-- Table: customer_address
CREATE TABLE customer_address (
    id serial  NOT NULL,
    nip varchar(15)  NOT NULL,
    country_id int  NOT NULL,
    province_id int  NOT NULL,
    city varchar(63)  NOT NULL,
    street varchar(63)  NOT NULL,
    street2 varchar(63)  NULL,
    post_code varchar(15)  NOT NULL,
    CONSTRAINT customer_address_pk PRIMARY KEY (id)
);

-- Table: employee
CREATE TABLE employee (
    id serial  NOT NULL,
    nip varchar(15)  NULL,
    name varchar(63)  NOT NULL,
    surname varchar(63)  NOT NULL,
    email varchar(127)  NULL,
    phone varchar(15)  NULL,
    role varchar(127)  NOT NULL,
    CONSTRAINT employee_pk PRIMARY KEY (id)
);

-- Table: invoice
CREATE TABLE invoice (
    order_id int  NOT NULL,
    nip varchar(15)  NOT NULL,
    creation_date date  NOT NULL,
    days_until_due int  NOT NULL,
    paid boolean  NOT NULL,
    CONSTRAINT invoice_pk PRIMARY KEY (order_id)
);

-- Table: order
CREATE TABLE "order" (
    id serial  NULL,
    order_date date  NOT NULL,
    sell_date date  NOT NULL,
    reference_name varchar(31)  NULL,
    fulfilled boolean  NOT NULL DEFAULT false,
    shipment_type varchar(63)  NOT NULL,
    CONSTRAINT order_pk PRIMARY KEY (id)
);

-- Table: order_item
CREATE TABLE order_item (
    id serial  NOT NULL,
    order_id int  NOT NULL,
    product_id int  NOT NULL,
    amount int  NOT NULL,
    tax int  NOT NULL,
    price money  NOT NULL,
    CONSTRAINT order_item_pk PRIMARY KEY (id)
);

-- Table: product
CREATE TABLE product (
    id serial  NOT NULL,
    name varchar(127)  NOT NULL,
    category varchar(15)  NOT NULL,
    stock int  NOT NULL,
    CONSTRAINT product_pk PRIMARY KEY (id)
);

-- Table: province
CREATE TABLE province (
    id serial  NOT NULL,
    name varchar(63)  NOT NULL,
    CONSTRAINT province_pk PRIMARY KEY (id)
);

-- Table: singular_order
CREATE TABLE singular_order (
    order_id int  NOT NULL,
    nip varchar(15)  NOT NULL,
    name varchar(63)  NOT NULL,
    date int  NOT NULL,
    email varchar(127)  NULL,
    phone varchar(15)  NULL,
    customer_address_id int  NOT NULL,
    CONSTRAINT singular_order_pk PRIMARY KEY (order_id)
);

-- foreign keys
-- Reference: Hospital_Contract (table: contract)
ALTER TABLE contract ADD CONSTRAINT Hospital_Contract
    FOREIGN KEY (nip)
    REFERENCES customer (nip)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: People_Hospital (table: employee)
ALTER TABLE employee ADD CONSTRAINT People_Hospital
    FOREIGN KEY (nip)
    REFERENCES customer (nip)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: contract_Orders (table: contract_order)
ALTER TABLE contract_order ADD CONSTRAINT contract_Orders
    FOREIGN KEY (contract_id)
    REFERENCES contract (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: contract_item_contract (table: contract_item)
ALTER TABLE contract_item ADD CONSTRAINT contract_item_contract
    FOREIGN KEY (contract_id)
    REFERENCES contract (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: contract_item_product (table: contract_item)
ALTER TABLE contract_item ADD CONSTRAINT contract_item_product
    FOREIGN KEY (product_id)
    REFERENCES product (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: contract_order_order (table: contract_order)
ALTER TABLE contract_order ADD CONSTRAINT contract_order_order
    FOREIGN KEY (order_id)
    REFERENCES "order" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: customer_address_singular_order (table: singular_order)
ALTER TABLE singular_order ADD CONSTRAINT customer_address_singular_order
    FOREIGN KEY (customer_address_id)
    REFERENCES customer_address (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: hospital_address_country (table: customer_address)
ALTER TABLE customer_address ADD CONSTRAINT hospital_address_country
    FOREIGN KEY (country_id)
    REFERENCES country (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: hospital_address_province (table: customer_address)
ALTER TABLE customer_address ADD CONSTRAINT hospital_address_province
    FOREIGN KEY (province_id)
    REFERENCES province (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: hospital_hospital_address (table: customer_address)
ALTER TABLE customer_address ADD CONSTRAINT hospital_hospital_address
    FOREIGN KEY (nip)
    REFERENCES customer (nip)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: invoice_order (table: order)
ALTER TABLE "order" ADD CONSTRAINT invoice_order
    FOREIGN KEY (id)
    REFERENCES invoice (order_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: order_item_product (table: order_item)
ALTER TABLE order_item ADD CONSTRAINT order_item_product
    FOREIGN KEY (product_id)
    REFERENCES product (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: order_order_item (table: order_item)
ALTER TABLE order_item ADD CONSTRAINT order_order_item
    FOREIGN KEY (order_id)
    REFERENCES "order" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: order_shipment (table: carrier_shipment)
ALTER TABLE carrier_shipment ADD CONSTRAINT order_shipment
    FOREIGN KEY (order_id)
    REFERENCES "order" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: singular_order_order (table: singular_order)
ALTER TABLE singular_order ADD CONSTRAINT singular_order_order
    FOREIGN KEY (order_id)
    REFERENCES "order" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

