import { useStorage } from "@vueuse/core";

const store = useStorage<{
  currentTabName: string | undefined;
  openedTabNames: string[];
}>("web-tools-edit-tabs", {
  currentTabName: undefined,
  openedTabNames: [],
});

export const useEditTabs = () => {
  const openedTabNames = computed(() => [...store.value.openedTabNames]);
  const currentTabName = computed(() => store.value.currentTabName);
  const addTab = (name: string) => {
    const oldOpenedTabNames = [...store.value.openedTabNames];
    const newOpenedTabNames = oldOpenedTabNames.includes(name)
      ? [...oldOpenedTabNames]
      : [...oldOpenedTabNames, name];
    store.value = {
      openedTabNames: newOpenedTabNames,
      currentTabName: name,
    };
  };
  const removeTab = (name: string) => {
    const oldOpenedTabNames = [...store.value.openedTabNames];
    const newOpenedTabNames = oldOpenedTabNames.filter((e) => e !== name);
    store.value = {
      openedTabNames: newOpenedTabNames,
      currentTabName: newOpenedTabNames[0],
    };
  };
  const activeTab = (name: string) => {
    store.value = {
      ...store.value,
      currentTabName: name,
    };
  };
  return {
    openedTabNames,
    currentTabName,
    addTab,
    removeTab,
    activeTab,
  };
};
