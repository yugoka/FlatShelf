import Vue from "vue"

export const merge = function (target, value, propName) {
  if (
    Object.prototype.toString.call(value) === "[object Object]" &&
    (!propName || target.hasOwnProperty(propName))
  ) {
    const obj = propName == null ? target : target[propName]

    if (obj != null) {
      for (const prop in value) {
        if (
          prop != "prototype" &&
          prop != "constructor" &&
          prop != "__proto__"
        ) {
          merge(obj, value[prop], prop)
        }
      }
      return
    }
  }

  Vue.set(target, propName, value)
}
