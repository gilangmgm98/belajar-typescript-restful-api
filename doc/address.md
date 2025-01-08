# **Address API Specification**

## Create Address

Endpoint : **POST** `/api/contacts/:idContact/addresses`

Request Header :

- X-API-Token : `token`

Request Body :

```json
{
  "street": "Jl. apaya",
  "city": "Kota Angin",
  "province": "Provinsi Daun",
  "country": "Konoha",
  "postal_code": "13853"
}
```

Response Body (Success):

```json
{
    "id": 1,
    "street": "Jl. apaya",
    "city": "Kota Angin",
    "province": "Provinsi Daun",
    "country": "Konoha",
    "postal_code": "13853"
}
```

Response Body (Failed):

```json
{
  "error": "Postal Code is required"
}
```

## Get Address

Endpoint : **POST** `/api/contacts/:idContact/addresses/:idAddress`

Request Header :

- X-API-Token : `token`

Response Body (Success):

```json
{
    "id": 1,
    "street": "Jl. apaya",
    "city": "Kota Angin",
    "province": "Provinsi Daun",
    "country": "Konoha",
    "postal_code": "13853"
}
```

Response Body (Failed):

```json
{
  "error": "Address not found"
}
```

## Update Address

Endpoint : **PUT** `/api/contacts/:idContact/addresses/:idAddress`

Request Header :

- X-API-TOKEN : `token`

Request Body :

```json
{
  "street": "Jl. apaya",
  "city": "Kota Angin",
  "province": "Provinsi Daun",
  "country": "Konoha",
  "postal_code": "13853"
}
```

Response Body (Success):

```json
{
    "id": 1,
    "street": "Jl. apaya",
    "city": "Kota Angin",
    "province": "Provinsi Daun",
    "country": "Konoha",
    "postal_code": "13853"
}
```

Response Body (Failed):

```json
{
  "error": "Postal Code is required"
}
```

## Remove Address

Endpoint : **DELETE** `/api/contacts/:idContact/addresses/:idAddress`

Request Header :

- X-API-TOKEN : `token`

Response Body (Success):

```json
{
    "success": true,
    "message": "Remove Address Successfully"
}
```

Response Body (Failed):

```json
{
  "error": "Address not found"
}
```

Response Body (Failed):

```json
{
  "error": "Unauthorized"
}
```

## List Address

Endpoint : **GET** `/api/contacts/:idContact/addresses/:idAddress`

Request Header :

- X-API-TOKEN : `token`

Response Body (Success):

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jl. apaya",
      "city": "Kota Angin",
      "province": "Provinsi Daun",
      "country": "Konoha",
      "postal_code": "13853"
    }
    {
      "id": 2,
      "street": "Jl. yapaya",
      "city": "Kota Air",
      "province": "Provinsi Api",
      "country": "Gakure",
      "postal_code": "13853"
    }
  ]
}
```

Response Body (Failed):

```json
{
  "error": "Contact is not found"
}
```
