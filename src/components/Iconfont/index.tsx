import { ICON_FONT_URL } from '@/config';
import { createFromIconfontCN } from '@ant-design/icons';

export const LegacyIconfont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});

export interface IconfontProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  type: string;
}
export const Iconfont: React.FC<IconfontProps> = ({
  type,
  className,
  ...rest
}) => {
  return <i {...rest} className={`iconfont ${type} ${className}`} />;
};
