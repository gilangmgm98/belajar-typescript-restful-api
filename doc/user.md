# **User API Specification**

## Register User

Endpoint : **POST** `/api/users`

Request Body :

```json
{
  "username": "gilangmgm",
  "password": "rahasia123",
  "name": "Gilang Murdiyanto"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "gilangmgm",
    "name": "Gilang Murdiyanto"
  }
}
```

Response Body (Failed):

```json
{
  "error": "username already registered"
}
```

Response Body (Failed):

```json
{
  "error": "username must not blank"
}
```

## Login User

Endpoint : **POST** `/api/users/login`

Request Body :

```json
{
  "username": "gilangmgm",
  "name": "Gilang Murdiyanto",
  "password": "rahasia123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "gilangmgm",
    "name": "Gilang Murdiyanto",
    "token": "UUID"
  }
}
```

Response Body (Failed) :

```json
{
  "error": "wrong username or password"
}
```

## Get User

Endpoint : **GET** `/api/users/current`

Request Header :

- X-API-TOKEN : `token`

Response Body (Success):

```json
{
  "data": {
    "username": "gilangmgm",
    "name": "Gilang Murdiyanto"
  }
}
```

Response Body (Failed):

```json
{
  "error": "Unauthorized"
}
```

## Update User

Endpoint : **PATCH** `/api/users/current`

Request Header :

- X-API-TOKEN : `token`

Request Body :

```json
{
  "name": "Gilang Murdiyanto", //Tidak Wajib (bisa kirim salah satu)
  "password": "rahasia123" //Tidak Wajib (bisa kirim salah satu)
}
```

Response Body (Success):

```json
{
  "data": {
    "success": true,
    "message": "Update User Successfully"
  }
}
```

Response Body (Failed):

```json
{
  "error": "Unauthorized"
}
```

## Logout User

Endpoint : **DELETE** `/api/users/current`

Request Header :

- X-API-TOKEN : `token`

Response Body (Success):

```json
{
  "data": {
    "success": true,
    "message": "Delete User Successfully"
  }
}
```

Response Body (Failed):

```json
{
  "error": "Unauthorized"
}
```
