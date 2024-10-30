import CategoriesList from '@/components/home/CategoriesList'
import PropertiesContainer from '@/components/home/PropertiesContainer'
import { Suspense } from 'react'
import LoadingCard from '@/components/card/LoadingCard'

function HomePage({
  searchParams,
}: {
  searchParams: { category?: string | undefined; search?: string | undefined; }
}) {
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
