/**
 * validate email address
 */
export default (email: string) => {
    const reg = /\S+@\S+\.\S+/
    return reg.test(email)
}