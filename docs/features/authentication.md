# User Authentication

## Sign up

On registration, users provide:

- Username (starts with @, e.g., @john_doe)
- Email address
- Password
- Full name
- Profile picture (optional)

They can also choose to sign up with Google. In that case, email, full name, and profile picture are fetched from their Google account. Username must be generated.

> [!NOTE]
> [Check Token Payload Google documentation](https://docs.cloud.google.com/nodejs/docs/reference/google-auth-library/latest/google-auth-library/tokenpayload)

## Log in

They can log in using either their username or email address along with their password. 

Google login is also supported. The user must be identified by their Google sub field.