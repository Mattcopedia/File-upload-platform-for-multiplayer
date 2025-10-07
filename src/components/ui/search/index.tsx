import { Input, InputAdornment } from '@mui/material';

import SearchIcon from '@/assets/icons/search.svg';
import { SearchInputProps } from '@/components/ui/search/type';

const SearchInputComponent = (props: SearchInputProps) => {
  return (
    <Input
      data-variant='search'
      type='search'
      startAdornment={
        <InputAdornment position='start'>
          <SearchIcon height='16px' width='16px' />
        </InputAdornment>
      }
      {...props}
    />
  );
};

export default SearchInputComponent;
