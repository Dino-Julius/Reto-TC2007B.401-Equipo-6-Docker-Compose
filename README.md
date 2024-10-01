# ZazilApp

Bienvenido a **ZazilApp**, una aplicación diseñada para el manejo de diferentes funcioanlidades aisladas en contenedores docker.

## Descripción del Proyecto

ZazilApp es una aplicación que complementa por medio de servicios aislados la aplicación móvil. Su objetivo principal es por medio de docker-compose tener contenedores aislados para los servicios de api, nginx, web (frontend) y la base de datos (postgresql).

## Uso

Para ejecutar la aplicación, utiliza el siguiente comando:

```bash
docker-compose up --build
```

## Licencia
Este proyecto está licenciado bajo la Licencia MIT LICENSE.

## Submódulos

Este proyecto incluye un submódulo llamado **web**. Para inicializar y actualizar el submódulo, utiliza los siguientes comandos:

```bash
git submodule init
git submodule update
```

## Extensión del Proyecto

Este proyecto es una extensión del proyecto de [Reto-TC2007B.401-Equipo-6](https://github.com/Dino-Julius/Reto-TC2007B.401-Equipo-6.git).