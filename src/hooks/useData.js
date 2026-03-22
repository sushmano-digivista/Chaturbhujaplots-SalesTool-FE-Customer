import { useQuery, useMutation } from '@tanstack/react-query'
import { contentApi, plotSummaryApi, leadApi } from '@/api'
import toast from 'react-hot-toast'

export function useContent() {
  return useQuery({
    queryKey: ['content'],
    queryFn:  contentApi.getAll,
    // staleTime inherited from QueryClient default (0) — always fetch fresh DB data
  })
}

export function usePlotSummary() {
  return useQuery({
    queryKey: ['plot-summary'],
    queryFn:  plotSummaryApi.getSummary,
    staleTime: 60_000,
  })
}

export function useSubmitLead() {
  return useMutation({
    mutationFn: leadApi.submit,
    onSuccess: () => toast.success('Thank you! Our team will contact you shortly.'),
    onError:   (e) => toast.error(e?.response?.data?.message || 'Submission failed. Please try again.'),
  })
}
