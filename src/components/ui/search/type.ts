import { ChangeEventHandler } from 'react';

export interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined;
  className?: string;
}
