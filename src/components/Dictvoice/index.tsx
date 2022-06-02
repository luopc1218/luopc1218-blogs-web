import { playWordVoice } from '@/utils';
import { SoundOutlined } from '@ant-design/icons';
import { Space } from 'antd';

interface DictvoiceProps {
  word: string;
}

export const Dictvoice = (props: DictvoiceProps) => {
  const { word } = props;

  const handlePlayVoice = () => {
    playWordVoice(word);
  };

  return <SoundOutlined onClick={handlePlayVoice} />;
};

interface WordRenderProps {
  word: string;
}

export const WordRender = (props: WordRenderProps) => {
  const { word } = props;
  return (
    <Space>
      <span>{word}</span>
      <Dictvoice word={word} />
    </Space>
  );
};

export default Dictvoice;
