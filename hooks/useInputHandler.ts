import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from "react";

export const useStringInputHandler = (
  defaultValue: string
): [
  string,
  { value: string; onChange: (evt: ChangeEvent<HTMLInputElement>) => void },
  Dispatch<SetStateAction<string>>
] => {
  const [value, setValue] = useState<string>(defaultValue);

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.currentTarget.value);
  };

  const inputHandlerProps = useMemo(
    () => ({
      value,
      onChange,
    }),
    [value]
  );

  return [value, inputHandlerProps, setValue];
};
