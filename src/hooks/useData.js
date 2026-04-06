import { useQuery, useMutation } from '@tanstack/react-query'
import { contentApi, plotSummaryApi, leadApi, pricingApi, settingsApi, projectsApi, i18nApi } from '@/api'
import { ACTIVE_PROJECTS } from '@/constants/projects'
import toast from 'react-hot-toast'

export function useContent() {
  return useQuery({
    queryKey: ['content'],
    queryFn:  contentApi.getAll,
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

// -- Contact Settings --------------------------------------------------
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

// -- Projects ----------------------------------------------------------
// Uses ACTIVE_PROJECTS as immediate placeholder so UI never blocks.
// DB data merges in the background — zero loading flash.
export function useProjects() {
  const { data: remoteProjects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn:  projectsApi.getAll,
    staleTime: 0,
    retry: 2,
    placeholderData: [],
  })

  // Merge: DB data overrides local fallback, static fields always from local
  const projects = ACTIVE_PROJECTS.map(local => {
    const remote = remoteProjects?.find(p => p.id === local.id)
    if (!remote) return local
    return {
      ...local,
      ...remote,
      id:          local.id,
      accentClass: local.accentClass,
      heroImage:   local.heroImage,
      upcoming:    local.upcoming,
      pricing: remote.pricing || local.pricing,
      facings: remote.facings || local.facings,
    }
  })

  return { data: projects, isLoading: false, error }
}

// -- Single Project ----------------------------------------------------
export function useProject(id) {
  const { data: projects, isLoading, error } = useProjects()
  const project = projects?.find(p => p.id === id) || null
  return { data: project, isLoading, error }
}

// -- Translations -------------------------------------------------------
// Fetches all language translations from MongoDB. Falls back gracefully.
export function useTranslations() {
  return useQuery({
    queryKey: ['i18n'],
    queryFn:  i18nApi.getAll,
    staleTime: 10 * 60_000,   // translations rarely change — cache for 10 min
    retry: 1,
    placeholderData: null,
  })
}
