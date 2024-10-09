# Documentation de la Base de Datos para Zazil en PostgreSQL

# Descripción de las Tablas

## Tabla: Users

La tabla `Users` almacena información sobre los usuarios registrados en el sistema.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `user_id`            | `bigint`      | Identificador único del usuario (clave primaria, generado automáticamente). |
| `first_name`         | `text`        | Nombre del usuario. |
| `last_name`          | `text`        | Apellido del usuario. |
| `birth_date`         | `date`        | Fecha de nacimiento del usuario. |
| `gender`             | `text`        | Género del usuario. |
| `phone`              | `text`        | Número de teléfono del usuario. |
| `email`              | `text`        | Correo electrónico del usuario (único). |
| `password`           | `text`        | Contraseña del usuario. |
| `profile_pic`        | `text`        | Ruta de la imagen de perfil del usuario. |

## Tabla: Products

La tabla `Products` almacena información sobre los productos disponibles.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `sku`                | `text`        | Código único del producto (clave primaria). |
| `name`               | `text`        | Nombre del producto. |
| `price`              | `numeric`     | Precio del producto. |
| `description`        | `text`        | Descripción del producto. |
| `dimensions`         | `text`        | Dimensiones del producto. |
| `image_path`         | `text`        | Ruta de la imagen del producto. |
| `category`           | `text`        | Categoría del producto. |
| `rating`             | `double precision` | Calificación del producto. |
| `disponibility`      | `boolean`     | Disponibilidad del producto. |

## Tabla: Orders

La tabla `Orders` almacena información sobre las órdenes realizadas por los usuarios.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `order_id`           | `bigint`      | Identificador único de la orden (clave primaria, generado automáticamente). |
| `order_number`       | `text`        | Número único de la orden. |
| `user_email`         | `bigint`      | Correo electrónico del usuario que realizó la orden (referencia a `Users`). |
| `shipping_address`   | `text`        | Dirección de envío de la orden. |
| `shipping_status`    | `text`        | Estado del envío de la orden. |
| `order_date`         | `date`        | Fecha en que se realizó la orden. |
| `delivery_date`      | `date`        | Fecha de entrega de la orden. |
| `total_price`        | `numeric`     | Precio total de la orden. |

## Tabla: Orderitems

La tabla `Orderitems` almacena información sobre los ítems de cada orden.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `order_item_id`      | `bigint`      | Identificador único del ítem de la orden (clave primaria, generado automáticamente). |
| `order_number`       | `bigint`      | Número de la orden (referencia a `Orders`). |
| `product_sku`        | `text`        | Código del producto (referencia a `Products`). |
| `quantity`           | `int`         | Cantidad del producto en la orden. |
| `price`              | `numeric`     | Precio del producto en la orden. |

## Tabla: Partners

La tabla `Partners` almacena información sobre los socios registrados en el sistema.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `partner_id`         | `bigint`      | Identificador único del socio (clave primaria, generado automáticamente). |
| `first_name`         | `text`        | Nombre del socio. |
| `last_name`          | `text`        | Apellido del socio. |
| `birth_date`         | `date`        | Fecha de nacimiento del socio. |
| `email`              | `text`        | Correo electrónico del socio (único). |
| `password`           | `text`        | Contraseña del socio. |
| `account_status`     | `boolean`     | Estado de la cuenta del socio. |
| `account_type`       | `text`        | Tipo de cuenta del socio. |
| `profile_pic`        | `text`        | Ruta de la imagen de perfil del socio. |

## Tabla: Posts

La tabla `Posts` almacena información sobre las publicaciones realizadas por los socios.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `post_id`            | `bigint`      | Identificador único de la publicación (clave primaria, generado automáticamente). |
| `title`              | `text`        | Título de la publicación. |
| `summary`            | `text`        | Resumen de la publicación. |
| `date`               | `date`        | Fecha de la publicación. |
| `category`           | `text`        | Categoría de la publicación. |
| `partner_email`      | `text`        | Correo electrónico del socio que realizó la publicación (referencia a `Partners`). |
| `file_path`          | `text`        | Ruta del archivo de la publicación. |
| `image_path`         | `text`        | Ruta de la imagen de la publicación. |

## Tabla: Kits

La tabla `Kits` almacena información sobre los kits disponibles.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `kit_id`             | `bigint`      | Identificador único del kit (clave primaria, generado automáticamente). |
| `title`              | `text`        | Título del kit. |
| `description`        | `text`        | Descripción del kit. |
| `image_path`         | `text`        | Ruta de la imagen del kit. |
| `special_price`      | `numeric`     | Precio especial del kit. |
| `rating`             | `double precision` | Calificación del kit. |

## Tabla: Kititems

La tabla `Kititems` almacena información sobre los ítems de cada kit.

| Nombre de la Columna | Tipo de Datos | Descripción |
|----------------------|---------------|-------------|
| `kit_item_id`        | `bigint`      | Identificador único del ítem del kit (clave primaria, generado automáticamente). |
| `kit_id`             | `bigint`      | Identificador del kit (referencia a `Kits`). |
| `product_sku`        | `text`        | Código del producto (referencia a `Products`). |