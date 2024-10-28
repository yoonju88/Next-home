'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'

function NavSearch() {
  const searchParams = useSearchParams() // to access current url of query parameter :  URL의 쿼리 파라미터를 가져오는 데 사용
  const pathName = usePathname() // 현재 URL의 경로를 가져오는 훅
  const { replace } = useRouter()
  // useRouter: Next.js에서 제공하는 훅으로, 현재 페이지의 라우터 정보를 가져올 수 있습니다. 이를 통해 페이지 이동, 쿼리 파라미터 접근 등을 쉽게 할 수 있습니다.
  //	replace: replace 메서드는 현재의 URL을 변경하지만 브라우저의 히스토리에 새로운 항목을 추가하지 않고 현재 항목을 대체합니다. 일반적으로 사용자가 특정 조건에서 URL을 변경하고 싶을 때 사용합니다.
  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || ''
  )
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    replace(`${pathName}?${params.toString()}`)// replace 메서드를 사용하여 새로운 URL로 페이지를 이동
  }, 500)
  // **useDebouncedCallback**는 사용자가 입력할 때마다 발생하는 이벤트를 디바운스합니다. 
  //이는 사용자가 입력을 멈춘 후 지정한 시간(여기서는 300ms) 동안 함수가 호출되지 않도록 합니다. 
  //주로 성능을 개선하고 불필요한 API 호출을 줄이는 데 유용

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('')
    }
  }, [searchParams.get('search')])
  // search 쿼리 파라미터가 없으면 search 상태를 빈 문자열로 설정
  // 사용자가 검색어를 지웠을 때 상태를 업데이트하는 데 유용
  return (
    <Input
      type='text'
      placeholder='find a property...'
      className='max-w-xs dark:bg-muted'
      onChange={(e) => {
        setSearch(e.target.value)
        handleSearch(e.target.value)
      }}
      value={search}
    />
  )
}

export default NavSearch
