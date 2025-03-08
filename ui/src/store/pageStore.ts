import { create } from "zustand";
interface PageState {
  currentPage: "home" | "tracking";
  setCurrentPage: (page: "home" | "tracking") => void;
}

const usePageStore = create<PageState>((set) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export default usePageStore;
