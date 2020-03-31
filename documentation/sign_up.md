# Create a new user

## Request

**URL**

`/user/sign_up`

**Method:**

`POST`

**Body**

```javascript
{
  email: string,
  username: string,
  phone: string,
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
