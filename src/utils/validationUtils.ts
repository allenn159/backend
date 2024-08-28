type AllowedFields = string[];

export function validateAllowedFields<T extends Record<string, any>>(
  array: T[],
  allowedFields: AllowedFields
) {
  for (let item of array) {
    for (let key in item) {
      if (!allowedFields.includes(key)) {
        throw new Error(`Unwanted fields: ${key}`);
      }
    }
  }
}
