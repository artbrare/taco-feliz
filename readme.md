
# Taco Feliz API

Taco Feliz API es una aplicación RESTful construida con Node.js, Express y MongoDB para ser consumida por una app de delivery del restaurante "Taco Feliz". Esta API permite la creación, actualización, obtención y eliminación de usuarios, platillos, modificadores (extras) y ordenes (pedidos). 

1. [Instalación](#instalación)
2. [Esquemas utilizados](#esquemas-utilizados)
    - [Esquema de usuarios](#esquema-de-usuarios)
    - [Esquema de platillos](#esquema-de-platillos)
    - [Esquema de modificadores](#esquema-de-modificadores)
    - [Esquema de ordenes](#esquema-de-ordenes)
3. [Endpoints de la API](#endpoints-de-la-api)
    - [Auth](#auth)
        - [Login de usuario](#2-login-de-usuario)
        - [Registrar usuario](#1-registrar-usuario)
        - [Link de restauración de contraseña](#3-link-de-restauracin-de-contrasea)
        - [Restaurar contraseña desde link de restauración](#4-restaurar-contrasea-desde-link-de-restauracin)
        - [Logout de usuario](#5-logout-de-usuario)
    - [Usuarios](#usuarios)
        - [Obtener info personal](#1-obtener-info-personal)
        - [Actualizar contraseña](#2-actualizar-contrasea)
        - [Actualizar datos de usuario (solo super-admin)](#3-actualizar-datos-de-usuario-solo-super-admin)
        - [Actualizar info personal](#4-actualizar-info-personal)
    - [Platillos](#platillos)
        - [Crear un platillo](#1-crear-un-platillo)
        - [Actualizar un platillo](#2-actualizar-un-platillo)
        - [Obtener un platillo](#3-obtener-un-platillo)
        - [Obtener todos los platillos (el menú)](#4-obtener-todos-los-platillos-el-men)
        - [Eliminar un platillo](#5-eliminar-un-platillo)
        - [Crear un modificador](#6-crear-un-modificador)
        - [Actualizar un modificador](#7-actualizar-un-modificador)
        - [Obtener modificadores de un platillo](#8-obtener-modificadores-de-un-platillo)
        - [Obtener un modificador](#9-obtener-un-modificador)
        - [Eliminar un modificador](#10-eliminar-un-modificador)
    - [Ordenes](#ordenes)
        - [Crear orden](#1-crear-orden)
        - [Actualizar orden desde creador de orden](#2-actualizar-orden-desde-creador-de-orden)
        - [Actualizar orden desde el restaurante](#3-actualizar-orden-desde-el-restaurante)
4. [Filtros API](#filtros-api)
5. [Trabajo posterior](#trabajo-posterior)

--------
## Instalación
### Requisitos previos
Para poder instalar Taco Feliz API, necesitas tener instalado lo siguiente:
- Node.js
- npm
- MongoDB

### Instrucciones
Clona este repositorio en tu maquina local:
```
git clone https://github.com/artbrare/taco-feliz
```
Instala las dependencias necesarias:
```
npm install
```
Crea un archivo `.env` en la carpeta `config` con las variables de entorno necesarias:
```bash
PORT = 3000
NODE_ENV = development // En caso de querer trabajar en entorno de desarrollo.
DB_LOCAL_URI = mongodb://0.0.0.0:27017/nombre_de_tu_base_de_datos

JWT_SECRET = asjhdahjsjnd231bkbi123das
JWT_EXPIRES_TIME = 5m
COOKIE_EXPIRES_TIME = 5

SMTP_HOST = sandbox.smtp.mailtrap.io
SMTP_PORT = 2525
SMTP_EMAIL = "ingresa-tu-email"
SMTP_PASSWORD = "ingresa-tu-password"
SMTP_FROM_EMAIL = noreply@tacofeliz.com
SMTP_FROM_NAME = Taco Feliz


```
Inicia el servidor:
```
npm start
```

Una vez que hayas completado estos pasos, podrás utilizar el proyecto en tu máquina local en la dirección `http://localhost:PORT`.

Nota: al abrir `http://localhost:PORT` en tu navegador se desplegará la documentación de los endpoints de la API.

## Esquemas utilizados
### Esquema de usuarios
### Esquema de platillos
### Esquema de modificadores

## Endpoints de la API
### Auth

Rutas referidas a la autenticación de usuario. Se puede registrar usuarios, logear usuarios, logout de usuarios, enviar correo de restauración de contraseña y cambiar contraseña desde link de restauración.



#### 1. Registrar usuario


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



#### 2. Login de usuario


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



#### 3. Link de restauración de contraseña


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



#### 4. Restaurar contraseña desde link de restauración


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



#### 5. Logout de usuario


Ruta para cerrar sesión.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/logout
```



### Usuarios

Rutas para la funcionalidad de usuarios.



#### 1. Obtener info personal


Ruta para que el usuario actual pueda ver su información en la base de datos.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/info-personal
```



#### 2. Actualizar contraseña


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



#### 3. Actualizar datos de usuario (solo super-admin)


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



#### 4. Actualizar info personal


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



### Platillos

Todas las solicitudes relacionadas al menú del restaurante.



#### 1. Crear un platillo


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



#### 2. Actualizar un platillo


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



#### 3. Obtener un platillo


Ruta para obtener un platillo en especifico


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6
```



#### 4. Obtener todos los platillos (el menú)


Ruta para obtener una lista de platillos. Tiene capacidad de ordenamiento y filtrado.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo
```



#### 5. Eliminar un platillo


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



#### 6. Crear un modificador


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



#### 7. Actualizar un modificador



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



#### 8. Obtener modificadores de un platillo


Ruta para obtener los modificadores de un platillo en especifico.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6/modificador/
```



#### 9. Obtener un modificador


Ruta para obtener la información de un modificador de un platillo en especifico


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416f8d1a663d03a184d6b6/modificador/644170b2a55569f7451bceb1
```



#### 10. Eliminar un modificador


Ruta para eliminar un modificador de un platillo en especifico.


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{DOMAIN}}/api/v1/platillo/64416fac1a663d03a184d6bb/modificador/6441754b22deafb7054dec88
```



### Ordenes

Todas las rutas relacionadas con las ordenes o pedidos.



#### 1. Crear orden


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



#### 2. Actualizar orden desde creador de orden


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



#### 3. Actualizar orden desde el restaurante


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

>Generated at 2023-04-20 12:14:10 by [docgen](https://github.com/thedevsaddam/docgen)

## Filtros API

### filter()

Este método filtra los resultados de una consulta de MongoDB en base a una serie de parámetros recibidos en la URL. Primero hace una copia de la cadena de consulta, elimina los campos que no se necesitan y luego convierte los operadores de comparación en sintaxis de MongoDB. Finalmente, realiza la consulta utilizando los parámetros especificados y devuelve los resultados filtrados.

### sort()
Este método ordena los resultados de la consulta de acuerdo con los parámetros especificados en la URL. Si no se especifican campos de ordenamiento en la URL, ordena los resultados por fecha de creación en orden descendente.

### limitFields()

Este método limita los campos que se devuelven en los resultados de la consulta de acuerdo con los parámetros especificados en la URL. Si se especifican campos en la URL, se devuelven solo esos campos. De lo contrario, se devuelven todos los campos excepto el campo __v.


### pagination() 

Este método divide los resultados de la consulta en páginas y devuelve los resultados para una página específica de acuerdo con los parámetros especificados en la URL. Por defecto, se devuelve la primera página y se limita el número de resultados a 25 objetos por consulta. El número de página y el límite de resultados se especifican en la URL.


## Trabajo posterior

- Agregar **pruebas unitarias y pruebas de integración**: Es importante realizar pruebas unitarias exhaustivas para garantizar la calidad del código y detectar posibles errores. 

- Agregar **Imagenes de platillos**: Tener imagenes de cada platillo guardadas. Se puede realizar en la misma base de datos de MongoDB o se puede dedicar otra base para esto.

- Más rutas en **Ordenes** como son buscar las ordenes de un usuario en especifico, buscar todas las ordenes activas para el restaurante, etc.

- Implementar un **sistema de notificaciones**: Para mantener a los usuarios notificados y brindar un mejor servicio.

- Agregar funcionalidad de **reportes y estadísticas**: De esta manera, se pueden obtener insights valiosos para el restaurante.

---
[Regresar](#taco-feliz-api)
