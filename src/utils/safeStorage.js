// src/utils/safeStorage.js
const safeStorage = (() => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    console.log("✅ Using real localStorage");
    return localStorage;
  } catch (err) {
    console.warn("⚠️ localStorage disabled, using memory fallback");
    let memoryStore = {};
    return {
      getItem: (key) => memoryStore[key] || null,
      setItem: (key, value) => {
        memoryStore[key] = value;
      },
      removeItem: (key) => {
        delete memoryStore[key];
      },
      clear: () => {
        memoryStore = {};
      },
    };
  }
})();

export default safeStorage;
