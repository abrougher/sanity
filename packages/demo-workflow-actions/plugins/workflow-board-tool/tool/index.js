import React from 'react'
import PluginIcon from 'part:@sanity/base/plugin-icon'
import {Tool} from '../components/tool'
import {RouterProvider} from '../../../lib/router'

function Root(props) {
  return (
    <RouterProvider>
      <Tool {...props} />
    </RouterProvider>
  )
}

export default {
  icon: PluginIcon,
  name: 'workflow',
  title: 'Workflow',
  component: Root
}
