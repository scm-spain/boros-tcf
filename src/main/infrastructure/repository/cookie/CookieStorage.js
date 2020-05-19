/**
 * @interface
 */
class CookieStorage {
  load({key}) {}
  save({key, data}) {}
}

export {CookieStorage}
