import { ref, UnwrapRef, watch } from "vue";

export const usePropSync = <P extends object, K extends keyof P>(props: P, key: K) => {
  const initialValue = props[key];
  const innerValue = ref(initialValue);

  watch(
    () => props[key],
    (val) => {
      innerValue.value = val as UnwrapRef<P[K]>;
    },
  );

  return innerValue;
};
