import { assign } from "radash";
import { useRequest } from "vue-request";
import { ElMessage } from "element-plus";

export const useCustomRequest: typeof useRequest = (...rest) => {
  let [service, options, ...r] = rest;
  options = assign(
    {
      manual: true,
      onError: (error) => {
        console.log({ error });
        ElMessage({
          message: error.message,
          type: "error",
        });
      },
      debounceInterval: 300,
    },
    options || {}
  );
  return useRequest(service, options, ...r);
};
