# Documentation de la Base de Datos para Zazil en PostgreSQL

## Tabla: users
| Columna    | Tipo   | Descripción                        |
|------------|--------|------------------------------------|
| user_id    | bigint | Identificador único del usuario.   |
| first_name | text   | Nombre del usuario.                |
| last_name  | text   | Apellido del usuario.              |
| birth_date | date   | Fecha de nacimiento del usuario.   |
| gender     | text   | Género del usuario.                |
| phone      | text   | Teléfono del usuario.              |
| email      | text   | Correo electrónico único del usuario. |
| password   | text   | Contraseña del usuario.            |

## Tabla: addresses
| Columna   | Tipo   | Descripción                        |
|-----------|--------|------------------------------------|
| address_id| bigint | Identificador único de la dirección. |
| user_id   | bigint | Referencia al identificador del usuario. |
| address   | text   | Dirección del usuario.             |
| city      | text   | Ciudad de la dirección.            |
| state     | text   | Estado de la dirección.            |
| country   | text   | País de la dirección.              |

## Tabla: products
| Columna     | Tipo             | Descripción                        |
|-------------|------------------|------------------------------------|
| sku         | text             | Identificador único del producto (SKU). |
| name        | text             | Nombre del producto.               |
| price       | numeric          | Precio del producto.               |
| description | text             | Descripción del producto.          |
| dimensions  | text             | Dimensiones del producto.          |
| image_path  | text             | Ruta de la imagen del producto.    |
| category    | text             | Categoría del producto.            |
| rating      | double precision | Calificación del producto.         |

## Tabla: orders
| Columna             | Tipo   | Descripción                        |
|---------------------|--------|------------------------------------|
| order_id            | bigint | Identificador único del pedido.    |
| order_number        | text   | Número único del pedido.           |
| user_id             | bigint | Referencia al identificador del usuario. |
| shipping_address_id | bigint | Referencia al identificador de la dirección de envío. |
| shipping_status     | text   | Estado del envío del pedido.       |

## Tabla: orderitems
| Columna       | Tipo    | Descripción                        |
|---------------|---------|------------------------------------|
| order_item_id | bigint  | Identificador único del ítem del pedido. |
| order_id      | bigint  | Referencia al identificador del pedido. |
| product_sku   | text    | Referencia al identificador del producto (SKU). |
| quantity      | int     | Cantidad del producto en el pedido. |
| price         | numeric | Precio del producto en el pedido.   |

## Tabla: partners
| Columna       | Tipo    | Descripción                        |
|---------------|---------|------------------------------------|
| partner_id    | bigint  | Identificador único del socio.     |
| first_name    | text    | Nombre del socio.                  |
| last_name     | text    | Apellido del socio.                |
| birth_date    | date    | Fecha de nacimiento del socio.     |
| email         | text    | Correo electrónico único del socio. |
| password      | text    | Contraseña del socio.              |
| account_status| boolean | Estado de la cuenta del socio.     |
| account_type  | text    | Tipo de cuenta del socio.          |

## Tabla: posts
| Columna   | Tipo   | Descripción                        |
|-----------|--------|------------------------------------|
| post_id   | bigint | Identificador único del post.      |
| file_path | text   | Ruta del archivo del post.         |
| image_path| text   | Ruta de la imagen del post.        |
| title     | text   | Título del post.                   |
| author_id | bigint | Referencia al identificador del socio autor del post. |

## Tabla: kits
| Columna      | Tipo             | Descripción                        |
|--------------|------------------|------------------------------------|
| kit_id       | bigint           | Identificador único del kit.       |
| title        | text             | Título del kit.                    |
| description  | text             | Descripción del kit.               |
| image_path   | text             | Ruta de la imagen del kit.         |
| special_price| numeric          | Precio especial del kit.           |
| rating       | double precision | Calificación del kit.              |

## Tabla: kititems
| Columna      | Tipo   | Descripción                        |
|--------------|--------|------------------------------------|
| kit_item_id  | bigint | Identificador único del ítem del kit. |
| kit_id       | bigint | Referencia al identificador del kit. |
| product_sku  | text   | Referencia al identificador del producto (SKU). |



## Relaciones entre las tablas en la base de datos
- **users**:
    - No tiene relaciones entrantes, pero es referenciada por:
        - addresses a través de user_id
        - orders a través de user_id
- **addresses**:
    - Referencia a users a través de user_id
    - Es referenciada por:
        - orders a través de shipping_address_id
- **products**:
    - No tiene relaciones entrantes, pero es referenciada por:
        - orderitems a través de product_sku
        - kititems a través de product_sku
- **orders**:
    - Referencia a:
        - users a través de user_id
        - addresses a través de shipping_address_id
    - Es referenciada por:
        - orderitems a través de order_id
- **orderitems**:
    - Referencia a:
        - orders a través de order_id
        - products a través de product_sku
- **partners**:
    - No tiene relaciones entrantes, pero es referenciada por:
        - posts a través de author_id
- **posts**:
    - Referencia a partners a través de author_id
- **kits**:
    - No tiene relaciones entrantes, pero es referenciada por:
        - kititems a través de kit_id
- **kititems**:
    - Referencia a:
        - kits a través de kit_id
        - products a través de product_sku