import type { User } from '@/types/user';
import type { AvatarProps as AntdAvatarProps } from 'antd';
import { Avatar as AntdAvatar } from 'antd';
import { useMemo } from 'react';

interface AvatarProps extends AntdAvatarProps {
  user?: User;
  random?: boolean;
}

export const DEFAULT_AVATAR = 'https://joeschmoe.io/api/v1/jean';

export const Avatar: React.FC<AvatarProps> = ({ user, random, ...rest }) => {
  const avatarUrl = useMemo(() => {
    if (random) {
    }
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }
    return DEFAULT_AVATAR;
  }, [random, user?.avatarUrl]);
  return <AntdAvatar src={avatarUrl} {...rest} />;
};

export default Avatar;
