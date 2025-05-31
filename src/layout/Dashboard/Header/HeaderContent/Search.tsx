// material-ui
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks"
import { searchKeyword } from "@/redux/slices/searchSlice"
import { useNavigate } from "react-router-dom"

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    if(dispatch) {
      dispatch(searchKeyword(keyword))
    }
  }, [dispatch, keyword])

  // Hàm xử lý sự kiện onKeyDown
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigate(`/doha/danh-sach-ma-van-don`);
    }
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          placeholder={'Tìm mã sinh viên'}
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'weight',
          }}
          onKeyDown={handleKeyDown}
          onChange={(e) => setKeyword(e.target.value.trim())}
        />
      </FormControl>
    </Box>
  );
}