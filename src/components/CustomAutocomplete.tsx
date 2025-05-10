/*
Hướng dẫn sử dụng:
Giả sử danh sách options có cấu trúc như sau:
const options = [
  { username: "1", name: "Name 1", description: "Description for name 1" },
  { username: "2", name: "Name 2", description: "Description for name 2" },
];

- getOptionLabel: là một hàm dùng để định nghĩa cách hiển thị nhãn (label) cho mỗi tùy chọn trong danh sách.
<CustomAutocomplete
  apiUrl="/api/example"
  name="example"
  label="Example Label"
  getOptionLabel={(option) => `${option.id} - ${option.name}`}
/>

- idField: là trường xác định key chính.
<CustomAutocomplete
  apiUrl="/api/example"
  name="example"
  label="Example Label"
  idField="username"
/>

-defaultOptions: là giá trị filter mặc định
<CustomAutocomplete
  apiUrl="/api/example"
  name="example"
  label="Example Label"
  defaultOptions={{ 'filter.isActive': 'true' }}
/>
*/
import { useState, useEffect, useCallback } from "react"
import { Autocomplete } from "@mui/material"
import { TextValidator } from "react-material-ui-form-validator"
import _, { debounce } from "lodash"
import TextField from "@mui/material/TextField"
import { AxiosCoreInstance } from "@/utils/axiosCoreInstance";
import type { AxiosInstance } from "axios"

// Định nghĩa kiểu mặc định cho option
type DefaultOption = {
  id: string;
  name: string;
};

type RequestParams = {
  [key: string]: string;
}

type CustomAutocompleteProps<T = DefaultOption> = {
  name: string,
  label: string,
  apiUrl: string;
  onSelect?: (value: T | null) => void,
  defaultValue?: string | null,
  defaultOptions?: object,
  getOptionLabel?: (option: T) => string,
  idField?: keyof T,
  nameField?: keyof T,
  fullWidth?: boolean,
  validators?: string [],
  errorMessages?: string [],
  sxSelect?: object,
  sxTextbox?: object,
  axiosInstance?: AxiosInstance,
};


function CustomAutocomplete<T extends DefaultOption = DefaultOption>({
                                                                       name,
                                                                       apiUrl,
                                                                       label,
                                                                       defaultValue,
                                                                       defaultOptions,
                                                                       onSelect,
                                                                       validators = [],
                                                                       errorMessages = [],
                                                                       fullWidth = true,
                                                                       getOptionLabel = (option) => (option as DefaultOption).name,
                                                                       idField = 'id',
                                                                       nameField = 'name',
                                                                       sxSelect = {},
                                                                       sxTextbox = {},
                                                                       axiosInstance = AxiosCoreInstance,
                                                                     }: CustomAutocompleteProps<T>) {

  const [options, setOptions] = useState<T[]>([]) // Sử dụng generic T cho options
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1) // Tổng số trang
  const [params, setParams] = useState<RequestParams>({
    page: '1',
    search: '',
    limit: '20',
    ...defaultOptions
  })

  const [selectedValue, setSelectedValue] = useState<T | null>(null) // Giá trị được chọn

  useEffect(() => {
    if(defaultOptions !== undefined) {
      const newParams = Object.assign({}, params, defaultOptions);
      if(!_.isEqual(newParams, params)) {
        setParams(newParams)
      }
    }
  }, [defaultOptions])

  // Hàm gọi API để lấy dữ liệu, có debounce
  const fetchData = useCallback(
    debounce(async (requestParams: RequestParams) => {
      if (loading || !apiUrl) return // Tránh gọi API nhiều lần cùng một lúc

      setLoading(true)

      try {
        for (let key in requestParams) {
          if (key.startsWith('filter.') && _.isEmpty(requestParams[key])) {
            delete requestParams[key]
          }
        }
        const response = await axiosInstance.get(apiUrl, {
          params:requestParams
        })
        const data = response.data
        // Kiểm tra và gán đúng giá trị từ `data`
        if (data && data.data) {
          if(defaultValue) {
            const singleOptions = data.data.find((item: any) => item[idField] === defaultValue);
            if (singleOptions) {
              const newOptions = {
                ...singleOptions,
                id: singleOptions[idField],
                name:  singleOptions[nameField],
              }
              setSelectedValue(newOptions)
              setOptions([newOptions])
            }
          } else {
            const listOptions = data.data.map((item: any) => {
              return {
                ...item,
                id: item[idField],
                name:  item[nameField],
              }
            })
            setOptions((prev) => (requestParams.page === '1' ? listOptions : [...prev, ...listOptions]))
            setTotalPages(data.meta?.totalPages || 1)
          }
        } else {
          console.error("API response không có trường 'data'")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }, 300), // 300ms debounce
    [apiUrl, params]
  )

  useEffect(() => {
    if(defaultValue) {
      const defaultOption = options.find((item: any) => item[idField] === defaultValue)
      if (defaultValue && defaultOption) {
        setSelectedValue(defaultOption)
      }
    }
  }, [options, defaultValue, idField])

  // Gọi fetchData khi params thay đổi
  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  // Khi cuộn xuống dưới cùng để tải thêm dữ liệu
  const handleScroll = (event: any) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight
    if (bottom && parseInt(params.page) < totalPages) {
      setParams((prevParams) => ({
        ...prevParams,
        page: (Number(prevParams.page) + 1).toString()
      }));

    }
  }

  // Khi thay đổi giá trị của Autocomplete, cập nhật query
  const handleInputChange = (event: any, value: string, reason: string) => {
    if(['input', 'clear'].includes(reason)) {
      const newParams = 'filter.id' in params ? _.omit(params,'filter.id') : params
      setParams({...newParams, search: value, page: '1'})
      setOptions([])
    }
  }

  return (
    <Autocomplete
      disablePortal
      fullWidth={fullWidth}
      options={options}
      loading={loading}
      value={selectedValue}
      onChange={(event, newValue) => {
        if (onSelect) {
          onSelect(newValue)
        }
        setSelectedValue(newValue)
      }}
      onInputChange={handleInputChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) =>
        option?.[idField as keyof T] === value?.[idField as keyof T] // Chỉ định rõ ràng rằng idField là key của T
      }
      renderOption={(props, option) => (
        <li {...props} key={option[idField as keyof T] as string}> {/* Sử dụng idField làm key */}
          {getOptionLabel(option)}
        </li>
      )}
      renderInput={(params) => validators?.length > 0 ?
        <TextValidator
          {...params}
          name={name}
          label={label}
          value={selectedValue}
          validators={validators}
          errorMessages={errorMessages}
          sx={{...sxTextbox}}
        /> :
        <TextField
          {...params}
          name={name}
          label={label}
          value={selectedValue}
          sx={{...sxTextbox}}
        />
      }
      slotProps={{
        listbox: {
          onScroll: handleScroll,
          sx: {
            maxHeight: 140,
            overflowY: 'auto'
          }
        },
      }}
      sx={{mb: 2,
        ...sxSelect,
        "& .MuiInputBase-root": {
          padding: 0.5,
          height: '36px'
        },
      }}
    />
  )
}

export default CustomAutocomplete