import { usePage, useUrlParams } from '@/hooks';
import { ArticleList } from '../components';

export const SearchResultPage = () => {
  const [urlParams] = useUrlParams();

  usePage({
    pagePath: [
      {
        title: '搜索结果：' + urlParams.words,
        path: '/searchResult?string=' + urlParams.words,
      },
    ],
  });
  return (
    <div className="searchResultPage page">
      <ArticleList words={urlParams.words} timestamp={urlParams.timestamp} />
    </div>
  );
};

export default SearchResultPage;
