/**
 * blog related types
 */
declare namespace IBlog {
  interface BlogCreationRequest {
    title?: string,
    label?: string[],
    title_image?: string, // title image url
    description?: string,
    field?: string,
  }
}