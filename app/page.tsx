import CategoriesList from '@/components/home/CategoriesList'
import PropertiesContainer from '@/components/home/PropertiesContainer'
import { Suspense } from 'react'
import LoadingCard from '@/components/card/LoadingCard'
import { GetServerSideProps } from 'next';

type SearchParams = {
  category?: string;
  search?: string;
};

type HomePageProps = {
  searchParams: SearchParams;
};

function HomePage({
  searchParams,
}: HomePageProps
) {
  const { category, search } = searchParams;

  return (
    <section>
      <CategoriesList
        category={category}
        search={search}
      />
      <Suspense fallback={<LoadingCard />}>
        <PropertiesContainer
          category={category}
          search={search}
        />
      </Suspense>
    </section>
  )
}
export default HomePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category, search } = context.query;

  return {
    props: {
      searchParams: {
        category: category || null,
        search: search || null,
      },
    },
  };
};


