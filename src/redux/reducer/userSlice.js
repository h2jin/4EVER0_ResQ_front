import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mem_code: '', // 사번
  name: '', // 성명
  position_name: '', // 직급명
  dept_name: '', // 부서명
  role: '' // 역할
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action) {
      const { data } = action.payload;
      return { ...state, ...data };
    }
  }
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
