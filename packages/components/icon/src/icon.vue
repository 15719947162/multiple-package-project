<template>
  <i class="hhb-icon" :class="`hhb-icon-${_type}`" v-bind="$attrs">
    <slot />
  </i>
</template>
<script>
// export default {
//   name:"HhbIcon"
// }
</script>
<script lang="ts" setup>
import { computed } from 'vue'
// eslint-disable-next-line import/order
import { addUnit, isUndefined } from '@multiple-package-project/utils'
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'HhbIcon',
  inheritAttrs: false,
})
const props = defineProps(iconProps)
const _type = computed(() => props.type || '')

// const style = computed<CSSProperties>(() => {
//   if (!props.size && !props.color) return {}

//   return {
//     fontSize: isUndefined(props.size) ? undefined : addUnit(props.size),
//     color: props.color,
//   }
// })
</script>
