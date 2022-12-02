function deepCopy<T>(editRow: T): T {
  return JSON.parse(JSON.stringify(editRow));
}

export default deepCopy;
