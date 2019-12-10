import schemaTypes from 'all:part:@sanity/base/schema-type'
import createSchema from 'part:@sanity/base/schema-creator'
import workflowSchemaTypes from 'part:workflow-actions/schemas'

const post = {
  type: 'document',
  name: 'post',
  title: 'Post',
  fields: [
    {type: 'string', name: 'title', title: 'Title'},
    {
      type: 'reference',
      name: 'workflowMetadata',
      title: 'Workflow metadata',
      description: 'NOTE: This will be a hidden field!',
      to: [{type: 'workflow.metadata'}]
    }
  ]
}

export default createSchema({
  name: 'demo-workflow-actions',
  types: schemaTypes.concat([post, ...workflowSchemaTypes])
})
