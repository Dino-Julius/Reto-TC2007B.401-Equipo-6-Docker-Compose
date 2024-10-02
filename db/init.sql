-- Crear el usuario
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'zazil') THEN
        CREATE USER zazil WITH PASSWORD 'z4Z1l';
    END IF;
END $$;


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
  password text
);
comment on table users is 'Stores user information including personal details and login credentials.';


-- Table: addresses
create table if not exists Addresses (
  address_id bigint primary key generated always as identity,
  user_id bigint references users (user_id),
  address text,
  city text,
  state text,
  country text
);
comment on table addresses is 'Stores addresses associated with users.';


-- Table: products
create table if not exists Products (
  sku text primary key,
  name text,
  price numeric,
  description text,
  dimensions text,
  image_path text,
  category text,
  rating double precision
);
comment on table products is 'Stores product details, including SKU, name, price, description, dimensions, image, category, and rating.';


-- Table: orders
create table if not exists Orders (
  order_id bigint primary key generated always as identity,
  order_number text unique,
  user_id bigint references users (user_id),
  shipping_address_id bigint references addresses (address_id),
  shipping_status text
);
comment on table orders is 'Stores order information including user, shipping address, and shipping status.';


-- Table: orderitems
create table if not exists Orderitems (
  order_item_id bigint primary key generated always as identity,
  order_id bigint references orders (order_id),
  product_sku text references products (sku),
  quantity int,
  price numeric
);
comment on table orderitems is 'Stores items within an order, linking products to orders.';


-- Table: partners
create table if not exists Partners (
  partner_id bigint primary key generated always as identity,
  first_name text,
  last_name text,
  birth_date date,
  email text unique,
  password text,
  account_status boolean,
  account_type text    
);
comment on table partners is 'Stores partner information, including personal details and account status.';


-- Table: posts
create table if not exists Posts (
  post_id bigint primary key generated always as identity,
  file_path text,
  image_path text,
  title text,
  author_id bigint references partners (partner_id)
);
comment on table posts is 'Stores post information, including file paths, images, title, and author.';

-- Table: kits
create table if not exists Kits (

  kit_id bigint primary key generated always as identity,
  title text,
  description text,
  image_path text,
  special_price numeric,
  rating double precision
);
comment on table kits is 'Stores kit information, including title, description, image, and special price.';


-- Table: kititems
create table if not exists Kititems (
  kit_item_id bigint primary key generated always as identity,
  kit_id bigint references kits (kit_id),
  product_sku text references products (sku)
);
comment on table kititems is 'Links products to kits, indicating which products are part of a kit.';
