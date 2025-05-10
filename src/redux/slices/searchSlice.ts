import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "@/redux/createAppSlice"

export interface SearchSliceState {
  keyword: string
}

const initialState: SearchSliceState = {
  keyword: '',
}

export const searchSlice = createAppSlice({
  name: 'search',
  initialState,
  reducers: create => ({
    searchKeyword: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.keyword = action.payload
      },
    )
  }),
  selectors: {
    selectKeyword: counter => counter.keyword,
  },
})


export const { searchKeyword } = searchSlice.actions

export const { selectKeyword } = searchSlice.selectors

export default searchSlice.reducer