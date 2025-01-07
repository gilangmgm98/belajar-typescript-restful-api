# **Contact API Specification**

## Create Contact

Endpoint : **POST** `/api/contacts`

Request Header :

- X-API-Token : `token`

Request Body :

```json
{
  "firs_name": "Gilang",
  "last_name": "Murdiyanto",
  "email": "gilangmgm@gmail.com",
  "phone": "021021021"
}
```

Response Body (Success):

```json
{
  "id": 1, // id of the contact (autoincrement)
  "first_name": "Gilang",
  "last_name": "Murdiyanto",
  "email": "gilangmgm@gmail.com",
  "phone": "021021021"
}
```

Response Body (Failed):

```json
{
  "error": "first_name must not be empty"
}
```

## Get Contact

Endpoint : **GET** `/api/contacts/:id`

Request Header :

- X-API-Token : `token`

Response Body (Success):

```json
{
  "id": 1, // id of the contact (autoincrement)
  "first_name": "Gilang",
  "last_name": "Murdiyanto",
  "email": "gilangmgm@gmail.com",
  "phone": "021021021"
}
```

Response Body (Failed):

```json
{
  "error": "Contact not found"
}
```

## Update Contact

Endpoint : **PUT** `/api/contacts/:id`

Request Header :

- X-API-TOKEN : `token`

Request Body :

```json
{
  "firs_name": "Gilang",
  "last_name": "Murdiyanto",
  "email": "gilangmgm@gmail.com",
  "phone": "021021021"
}
```

Response Body (Success):

```json
{
  "id": 1, // id of the contact (autoincrement)
  "first_name": "Gilang",
  "last_name": "Murdiyanto",
  "email": "gilangmgm@gmail.com",
  "phone": "021021021",
  "message": "Update Contact Successfully"
}
```

Response Body (Failed):

```json
{
  "error": "first_name must not be empty"
}
```

## Remove Contact

Endpoint : **DELETE** `/api/contacts/:id`

Request Header :

- X-API-TOKEN : `token`

Response Body (Success):

```json
{
  "success": true,
  "message": "Remove Contact Successfully"
}
```

Response Body (Failed):

```json
{
  "error": "Contact not found"
}
```

Response Body (Failed):

```json
{
  "error": "Unauthorized"
}
```

## Search Contact

Endpoint : **GET** `/api/contacts`

Query Parameter :

- name : string, 'contact firstname' or 'contact lastname' (optional)
- email : string, 'contact email' (optional)
- phone : number, 'phone number' (optional)
- page : number, default 1
- size : number, default 10

Request Header :

- X-API-TOKEN : `token`

Response Body (Success):

```json
{
    "data" : [
        {
            "id"            : 1, // id of the contact (autoincrement)
            "first_name"    : "Gilang",
            "last_name"     : "Murdiyanto",
            "email"         : "gilangmgm@gmail.com",
            "phone"         : "021021021"
        }
    ],
    "paging" : {
        "current_page" : 1,
        "total_page" : 10,
        "size" : 10
    }
}
```

Response Body (Failed):

```json
{
  "error": "Unauthorized"
}
```
