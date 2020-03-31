# Search an offer by his ID

## Request

**URL**

`/offer/:offerId`

**Method:**

`GET`

**Params**

- `offerId`: id of the offer to search

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
