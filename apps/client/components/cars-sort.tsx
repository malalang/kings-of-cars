'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function CarsSort({ value }: { value: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function changeSort(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (nextValue === 'featured') params.delete('sort')
    else params.set('sort', nextValue)
    router.push(`/cars${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return <select value={value} aria-label="Sort vehicles" onChange={(event) => changeSort(event.target.value)}>
    <option value="featured">Sort: Featured</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
    <option value="mileage-asc">Mileage: Lowest</option>
    <option value="year-desc">Year: Newest</option>
  </select>
}
