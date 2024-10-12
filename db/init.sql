-- -- Crear el usuario
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'zazil') THEN
--         CREATE USER zazil WITH PASSWORD 'z4Z1l';
--     END IF;
-- END $$;

-- Crear la base de datos solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'zazil_db') THEN
        CREATE DATABASE zazil_db WITH OWNER zazil;
    END IF;
END $$;

-- Conceder privilegios al usuario en la base de datos
GRANT ALL PRIVILEGES ON DATABASE zazil_db TO zazil;

-- Crear tablas solo si la base de datos existe
\connect zazil_db;

-- Table: users
create table if not exists Users (
    user_id bigint primary key generated always as identity,
    first_name text,
    last_name text,
    birth_date date,
    gender text,
    phone text,
    email text unique,
    password text,
    profile_pic text
);

-- Table: products
create table if not exists Products (
    sku text primary key,
    name text,
    price numeric,
    description text,
    dimensions text,
    image_path text,
    category text,
    rating double precision,
    disponibility boolean
);

-- Table: orders
create table if not exists Orders (
    order_id bigint primary key generated always as identity,
    order_number text unique,
    user_email text references users (email),
    shipping_address text,
    shipping_status text,
    order_date date,
    delivery_date date,
    total_price numeric
);

-- Table: orderitems
create table if not exists Orderitems (
    order_item_id bigint primary key generated always as identity,
    order_number text references orders (order_number),
    product_sku text references products (sku),
    quantity int,
    price numeric
);

-- Function to update order total price
create or replace function update_order_total() returns trigger as $$
BEGIN
  -- Calculate the new total price
  UPDATE orders
  SET total_price = (SELECT SUM(price * quantity) FROM orderitems WHERE order_number = NEW.order_number)
  WHERE order_number = NEW.order_number;
  RETURN NEW;
END;
$$ language plpgsql;

-- Trigger to call the function after insert, delete, or update on orderitems
create trigger update_order_total_trigger
after insert
or delete
or
update on orderitems for each row
execute function update_order_total ();

-- Table: partners
create table if not exists Partners (
    partner_id bigint primary key generated always as identity,
    first_name text,
    last_name text,
    birth_date date,
    email text unique,
    password text,
    account_status boolean,
    account_type text,
    profile_pic text
);

-- Table: posts
create table if not exists Posts (
    post_id bigint primary key generated always as identity,
    title text,
    summary text,
    date date,
    category text,
    partner_email text references partners (email),
    file_path text,
    image_path text
);

-- Table: kits
create table if not exists Kits (
    kit_id bigint primary key generated always as identity,
    title text,
    description text,
    image_path text,
    special_price numeric,
    rating double precision
);

-- Table: kititems
create table if not exists Kititems (
    kit_item_id bigint primary key generated always as identity,
    kit_id bigint references kits (kit_id),
    product_sku text references products (sku)
);