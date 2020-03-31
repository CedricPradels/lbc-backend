# Publish an offer

## Request

**URL**

`/offer/publish`

**Method:**

`POST`

**Body**

```javascript
{
  "title": string,
  "description": string,
  "price": number
}
```

## Response

**Code:** 200 <br />
**Content:**

```javascript
{
    _id: string,
    title: string,
    description: string,
    price: number,
    creator: {
    account: {
        username: string,
        phone: string
    },
    _id: string
    },
    created: date
}
```
