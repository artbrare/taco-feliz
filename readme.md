
# Taco Feliz API

Taco Feliz API es una RESTful API elaborada en Node.js, la cuál será consumida por una aplicación movil de entregas a domicilio para un restaurante llamado "Taco Feliz".

<!--- If we have only one group/collection, then no need for the "ungrouped" heading -->



## Endpoints

* [Auth](#auth)
    1. [Registrar usuario](#1-registrar-usuario)
    1. [Login de usuario](#2-login-de-usuario)
    1. [Link de restauración de contraseña](#3-link-de-restauracin-de-contrasea)
    1. [Restaurar contraseña desde link de restauración](#4-restaurar-contrasea-desde-link-de-restauracin)
    1. [Logout de usuario](#5-logout-de-usuario)
* [Usuarios](#usuarios)
    1. [Obtener info personal](#1-obtener-info-personal)
    1. [Actualizar contraseña](#2-actualizar-contrasea)
    1. [Actualizar datos de usuario (solo super-admin)](#3-actualizar-datos-de-usuario-solo-super-admin)
    1. [Actualizar info personal](#4-actualizar-info-personal)
* [Platillos](#platillos)
    1. [Crear un platillo](#1-crear-un-platillo)
    1. [Actualizar un platillo](#2-actualizar-un-platillo)
    1. [Obtener un platillo](#3-obtener-un-platillo)
    1. [Obtener todos los platillos (el menú)](#4-obtener-todos-los-platillos-el-men)
    1. [Eliminar un platillo](#5-eliminar-un-platillo)
    1. [Crear un modificador](#6-crear-un-modificador)
    1. [Actualizar un modificador](#7-actualizar-un-modificador)
    1. [Obtener modificadores de un platillo](#8-obtener-modificadores-de-un-platillo)
    1. [Obtener un modificador](#9-obtener-un-modificador)
    1. [Eliminar un modificador](#10-eliminar-un-modificador)
* [Ordenes](#ordenes)
    1. [Crear orden](#1-crear-orden)
    1. [Actualizar orden desde creador de orden](#2-actualizar-orden-desde-creador-de-orden)
    1. [Actualizar orden desde el restaurante](#3-actualizar-orden-desde-el-restaurante)

--------



## Auth

Rutas referidas a la autenticación de usuario. Se puede registrar usuarios, logear usuarios, logout de usuarios, enviar correo de restauración de contraseña y cambiar contraseña desde link de restauración.



### 1. Registrar usuario


Ruta para registrar usuarios. La contraseña se encripta.


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/registrar
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "nombre": "Arturo Bravo",
    "email": "artbrare@gmail.com",
    "password": "hola1234",
    "rol": "super admin"
}
```



### 2. Login de usuario


Ruta para login de usuario en la aplicación


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/login
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "email": "artbrare@gmail.com",
    "password": "12345678"
}
```



### 3. Link de restauración de contraseña


Se envia correo de restauración al usuario que olvidó su contraseña.


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/password/forgot
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "email": "artbrare@gmail.com"
}
```



### 4. Restaurar contraseña desde link de restauración


Se restaura contraseña a partir de link de restauración.


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/password/reset/14278ab3bc4d008f09cda42f71f2715696b18e74
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "password": "12345678"
}
```



### 5. Logout de usuario


Ruta para cerrar sesión.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/logout
```



## Usuarios

Rutas para la funcionalidad de usuarios.



### 1. Obtener info personal


Ruta para que el usuario actual pueda ver su información en la base de datos.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/info-personal
```



### 2. Actualizar contraseña


Ruta para actualizar contraseña.


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/password
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "currentPassword": "hola1234",
    "newPassword": "12345678"
}
```



### 3. Actualizar datos de usuario (solo super-admin)


Ruta para que el restaurante (super admin) actualizar un usuario. De momento solamente puede bloquear o desbloquear.


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/usuario/644014856bd7123e4b15d5e0
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "bloqueado": true
}
```



### 4. Actualizar info personal


Ruta para que un usuario modifique sus datos personales. No puede bloquearse o desbloquearse.


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/info-personal
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "nombre": "Arturo Bravo Reynaga"
}
```



## Platillos

Todas las solicitudes relacionadas al menú del restaurante.



### 1. Crear un platillo


Ruta para crear un platillo.


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/platillo
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
  "nombre": "Torta de jamon",
  "notas": "Torta tamaño jumbo",
  "precio": 5,
  "categoria": "plato fuerte",
  "modificadores": [
    {
      "nombre": "Salsa extra",
      "precio": 2.5
    },
    {
      "nombre": "Queso extra",
      "precio": 10
    }
  ]
}
```



### 2. Actualizar un platillo


Ruta para actualizar los datos de un platillo


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "precio": 6
}
```



### 3. Obtener un platillo


Ruta para obtener un platillo en especifico


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6
```



### 4. Obtener todos los platillos (el menú)


Ruta para obtener una lista de platillos. Tiene capacidad de ordenamiento y filtrado.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo
```



### 5. Eliminar un platillo


Ruta para eliminar un platillo.


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{DOMAIN}}/api/v1/platillo/6441722ca55569f7451bced3
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



### 6. Crear un modificador


Ruta para agregar un modificador a un platillo existente


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/platillo/64416fac1a663d03a184d6bb/modificador
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
  "nombre": "Extra salsa roja",
  "precio": 3.25
}
```



### 7. Actualizar un modificador



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6/modificador/64416f8d1a663d03a184d6b7
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "nombre": "extra salsa verde"
}
```



### 8. Obtener modificadores de un platillo


Ruta para obtener los modificadores de un platillo en especifico.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6/modificador/
```



### 9. Obtener un modificador


Ruta para obtener la información de un modificador de un platillo en especifico


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6/modificador/644170b2a55569f7451bceb1
```



### 10. Eliminar un modificador


Ruta para eliminar un modificador de un platillo en especifico.


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416fac1a663d03a184d6bb/modificador/6441754b22deafb7054dec88
```



## Ordenes

Todas las rutas relacionadas con las ordenes o pedidos.



### 1. Crear orden


Ruta para crear una orden. Se calcula el total de la orden y se envía un correo electrónico al usuario con la orden.

5 minutos después de crearse la orden, su estatus cambia a "entregado"


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/orden
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "platillos": [
        {
            "_id": "644175e522deafb7054deca6",
            "cantidad": 2,
            "modificadores": [
                {
                    "_id": "644175e522deafb7054deca8",
                    "cantidad": 1
                }
            ]
        },
        {
            "_id": "64416fac1a663d03a184d6bb",
            "cantidad": 1,
            "modificadores": []
        }
    ],
    "propina": 0.15,
    "metodoPago": "contra entrega"
}
```



### 2. Actualizar orden desde creador de orden


Ruta para actualizar una orden.


***Endpoint:***

```bash
Method: PUT
Type: GRAPHQL
URL: {{DOMAIN}}/api/v1/orden/owner/6441787fac7102b9398f76ab
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



### 3. Actualizar orden desde el restaurante


Ruta para editar una orden desde el restaurante. Solo puede modificar su estatus


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/orden/admin/6441787fac7102b9398f76ab
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "estatus": "entregado"
}
```



---
[Back to top](#taco-feliz-api)
