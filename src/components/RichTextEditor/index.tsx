import type { ReactQuillProps } from 'react-quill';
import ReactQuill from 'react-quill';
import './index.less';

export const RichTextEditor: React.FC<ReactQuillProps> = ({
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // 切换按钮
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // 用户自定义按钮值
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // 上标/下标
      [{ indent: '-1' }, { indent: '+1' }], // 减少缩进/缩进
      [{ direction: 'rtl' }], // 文本下划线

      [{ size: [] }], // 用户自定义下拉
      [{ header: [] }],

      [{ color: [] }, { background: [] }], // 主题默认下拉，使用主题提供的值
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // 清除格式
    ],
  },
  ...rest
}) => {
  return <ReactQuill className="richTextEditor" modules={modules} {...rest} />;
};
