import { createSlice } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    projectName: 'nextjs friend',
    projectVersion: '',
    projectDetails: {}
  },
  reducers: {
    version: (state, action) => {
      state.projectVersion = action.payload.version
    },
    projectAction: (state, action) => {
      state.projectDetails = action.payload.project
    }
  }
})

export const { version, projectAction } = globalSlice.actions

export default globalSlice.reducer
