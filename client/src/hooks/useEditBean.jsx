import { useMutation, useQueryClient } from 'react-query'
import * as api from '../api/Beans'
import toastOnBottomCenter from '../utils/customToast'

export default function useEditBean(userid) {
  const queryClient = useQueryClient();

  return useMutation(
    async (bean) => await api.editBean(userid, bean),
    {
      enabled: Boolean(userid),
      onSuccess: async (variables) => {
        await queryClient.invalidateQueries(['bean', variables[0].bean_id])
        await queryClient.invalidateQueries('ranges')
        toastOnBottomCenter('success', 'Coffee bean is edited successfully.')
      },
      onError: error => {
        toastOnBottomCenter('error', error.message ? error.message : 'An unknown error has ocurred.')
      }
    }
  )
}