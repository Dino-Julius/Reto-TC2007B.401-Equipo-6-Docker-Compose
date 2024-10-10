# Instalación y Configuración de Nginx

Este documento proporciona una guía paso a paso para instalar y configurar Nginx utilizando el archivo de configuración `nginxconfig` que se encuentra en esta carpeta.

## Requisitos Previos

- Un sistema operativo basado en Unix (por ejemplo, Ubuntu).
- Acceso a una terminal con privilegios de superusuario.

## Instalación de Nginx

1. **Actualizar el sistema:**
    ```sh
    sudo apt update
    sudo apt upgrade
    ```

2. **Instalar Nginx:**
    ```sh
    sudo apt install nginx
    ```

3. **Verificar la instalación:**
    ```sh
    nginx -v
    ```

## Configuración de Nginx

1. **Copiar el archivo de configuración:**
    ```sh
    sudo cp ~/zazilApp/nginx/nginx.conf /etc/nginx/nginx.conf
    ```

2. **Verificar la configuración de Nginx con el siguiente comando:**
    ```sh
    sudo nginx -t
    ```

## Iniciar y Administrar Nginx

- **Iniciar Nginx:**
    ```sh
    sudo systemctl start nginx
    ```

- **Detener Nginx:**
    ```sh
    sudo systemctl stop nginx
    ```

- **Reiniciar Nginx:**
    ```sh
    sudo systemctl restart nginx
    ```

- **Verificar el estado de Nginx:**
    ```sh
    sudo systemctl status nginx
    ```