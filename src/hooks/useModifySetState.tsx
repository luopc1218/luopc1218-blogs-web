export const useModifySetState = <T = any,>(
  setState: React.Dispatch<React.SetStateAction<T>>,
) => {
  const modifySetState = (key: string, value: any) => {
    return setState((oldState: any) => {
      const newState: any = { ...oldState };
      newState[key] = value;
      return newState;
    });
  };
  return modifySetState;
};

export default useModifySetState;
