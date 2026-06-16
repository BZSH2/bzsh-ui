import * as components from '../components'
import { componentMetadata } from '../components/metadata'

import type { Plugin } from 'vue'

function isPlugin(value: unknown): value is Plugin {
  return (
    (typeof value === 'object' || typeof value === 'function') &&
    value !== null &&
    'install' in value &&
    typeof value.install === 'function'
  )
}

export const defaultComponents = componentMetadata
  .map(({ exportName }) => components[exportName as keyof typeof components])
  .filter(isPlugin)
