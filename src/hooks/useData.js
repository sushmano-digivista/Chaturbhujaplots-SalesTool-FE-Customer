import { useQuery, useMutation } from '@tanstack/react-query'
import { contentApi, plotSummaryApi, leadApi, pricingApi, settingsApi } from '@/api'
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

export function usePricing() {
  return useQuery({
    queryKey: ['pricing'],
    queryFn:  pricingApi.getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
}

// ── Contact Settings ──────────────────────────────────────────────────────────
// Fetches ownerPhone and ownerEmail from MongoDB via CommonServices API.
export function useContactSettings() {
  return useQuery({
    queryKey: ['contact-settings'],
    queryFn:  settingsApi.getContact,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    placeholderData: {
      ownerPhone: '919739762698',
      ownerEmail: 'info@chaturbhuja.in',
    },
  })
}
