import {SyncUseCase} from '../../application/services/SyncUseCase'
import {AsyncUseCase} from '../../application/services/AsyncUseCase'
import {UseCaseAdapterFactory} from './UseCaseAdapterFactory'
import {inject} from '../../core/ioc/ioc'

export const tcfInstanceAdapter = (instance, key) => {
  if (instance instanceof SyncUseCase) {
    const useCaseAdapterFactory = inject(UseCaseAdapterFactory)
    return useCaseAdapterFactory.createSync({instance, key})
  }
  if (instance instanceof AsyncUseCase) {
    const useCaseAdapterFactory = inject(UseCaseAdapterFactory)
    return useCaseAdapterFactory.createAsync({instance, key})
  }
  return instance
}
