# Search offers by title

## Request

**URL**

`/offer/with-count`

**Method:**

`GET`

**Query**

- `title`: search in title
- `page`: actual page number. 3 results per page.
- `sort`: sort result by
  - `price-desc | price-asc`: price
  - `date-desc | date-asc`: creation date
- `priceMax`: search with maximum price (€)
- `priceMin`: search with minimum price (€)

## Response

**Code:** 200 <br />
**Content:**

```javascript
{
  count: number,
  offers: [
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
    },
    ...
    ]
}
```
