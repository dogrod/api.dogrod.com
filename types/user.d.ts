/**
 * user related types
 */
declare namespace IUser {
  interface UserSignupRequest {
    name?: string,
    username?: string,
    password?: string,
    email?: string,
    admin?: string,
    location?: string,
    age?: string,
    sex?: string,
    create_at?: Date,
    update_at?: Date,
  }

  interface UserLoginRequest {
    username?: string,
    email?: string,
    password: string,
  }
}