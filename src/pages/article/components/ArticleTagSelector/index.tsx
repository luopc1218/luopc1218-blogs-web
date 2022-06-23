import { useFetchData } from '@/hooks';
import apis from '@/utils/apis';
import { Select } from 'antd';
import { useMemo, useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

export interface ArticleTagSelectorProps {
  defaultNewTagList: string[];
  onNewTagListChange: (newTagList: string[]) => void;
  onChange?: any;
  value?: number[];
}

export const ArticleTagSelector: React.FC<ArticleTagSelectorProps> = ({
  value,
  onChange,
  defaultNewTagList,
  onNewTagListChange,
}) => {
  const [newTagList, setNewTagList] = useState<string[]>(defaultNewTagList);

  const [articleTagList] = useFetchData<{ id: number; name: string }[]>(
    apis.getArticleTagList,
    {
      defaultValues: [],
    },
  );

  const handleSelectChange = (newValue: string[]) => {
    const newValueArray: number[] = [];
    const newTagArray: string[] = [];
    newValue.forEach((item) => {
      const tagId = articleTagList?.find(
        (findItem) => findItem.name === item,
      )?.id;
      if (tagId) newValueArray.push(tagId);
      else {
        newTagArray.push(item);
      }
    });
    onChange(newValueArray);
    setNewTagList(newTagArray);
  };

  const selectValue = useMemo<string[]>(() => {
    const arr: string[] = [];
    value?.map((item: number) => {
      const tagName = articleTagList?.find(
        (findItem) => findItem?.id === item,
      )?.name;
      if (tagName) arr.push(tagName);
      else arr.push(item.toString());
    });

    return arr.concat(newTagList);
  }, [value, articleTagList]);

  const selectOptions = useMemo(
    () =>
      articleTagList?.map((item: any) => {
        return { label: item.name, value: item.id };
      }),
    [articleTagList],
  );

  useDeepCompareEffect(() => {
    onNewTagListChange(newTagList);
  }, [newTagList]);

  return (
    <Select
      value={selectValue}
      onChange={handleSelectChange}
      mode="tags"
      optionFilterProp="label"
    >
      {selectOptions?.map((item: any) => (
        <Select.Option key={item.label}>{item.label}</Select.Option>
      ))}
    </Select>
  );
};

export default ArticleTagSelector;
