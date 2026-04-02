import { useQuery, useMutation } from '@tanstack/react-query'
import { contentApi, plotSummaryApi, leadApi, pricingApi, settingsApi, projectsApi } from '@/api'
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
// Fetches ownerPhone, ownerEmail, aparna_contact_address from MongoDB
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
// Fetches all project content from MongoDB.
// Merges DB data with local projects.js fallback by project id.
// Static fields (accentClass, heroImage, upcoming) always come from local.
export function useProjects() {
  const { data: remoteProjects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn:  projectsApi.getAll,
    staleTime: 0,
    retry: 2,
  })

  // Merge: DB data overrides local fallback, static fields always local
  const projects = ACTIVE_PROJECTS.map(local => {
    const remote = remoteProjects?.find(p => p.id === local.id)
    if (!remote) return local
    return {
      ...local,
      ...remote,
      // Static fields always from local -- never overridden by DB
      id:          local.id,
      accentClass: local.accentClass,
      heroImage:   local.heroImage,
      upcoming:    local.upcoming,
      // Preserve local pricing/facings if DB has none
      pricing: remote.pricing || local.pricing,
      facings: remote.facings || local.facings,
    }
  })

  return { data: projects, isLoading, error }
}

// -- Single Project ----------------------------------------------------
export function useProject(id) {
  const { data: projects, isLoading, error } = useProjects()
  const project = projects?.find(p => p.id === id) || null
  return { data: project, isLoading, error }
}
