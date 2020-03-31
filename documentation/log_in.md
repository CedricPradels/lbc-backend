# Login user

## Request

**URL**

`/user/log_in`

**Method:**

`POST`

**Body**

```javascript
{
  email: string,
  password: string
}
```

## Response

**Code:** 200 <br />
**Content:**

```javascript
{
  _id: string,
  token: string,
  account: {
    username: string,
    phone: string
  }
}
```
