import { watch } from 'vue';

export function watchSkipFirst(source, callback, options = {}) {
  let isFirstRun = true;
  let oldValue;
  const firstRunCallback = options?.firstRunCallback || (() => {});
  
  // Simplesmente retorna a função stop do watch
  return watch(
    source,
    (newValue, oldValueParam) => {
      if (isFirstRun) {
        oldValue = newValue;
        isFirstRun = false;
		firstRunCallback(newValue, oldValue);
        return;
      }
      
      callback(newValue, oldValue);
      oldValue = newValue;
    },
    options
  );
}