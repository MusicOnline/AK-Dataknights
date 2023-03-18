import type { Ref, WritableComputedRef } from "vue";

export default function useDebounce<T>(
  value: T,
  delay: number = 500
): WritableComputedRef<T> {
  const debouncedValue = <Ref<T>>ref(value);
  let timer: ReturnType<typeof setTimeout>;
  const setter = (newValue: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  };
  return computed({
    get: () => debouncedValue.value,
    set: setter,
  });
}
