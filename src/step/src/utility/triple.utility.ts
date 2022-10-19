import type { ITriple } from '../stores/triple'

export interface IDehidratedTriple {
  object: string
  predicate: string
  subject: string
}

export function dehydrateTriple(triples: ITriple) {
  const objects = Object.keys(triples)
  const dehydratedTriples: Array<IDehidratedTriple> = []
  objects.forEach(object => {
    const objectIdx = dehydratedTriples.push(<IDehidratedTriple>{ object }) - 1
    const predicates = Object.keys(triples[object])
    predicates.forEach(predicate => {
      dehydratedTriples[objectIdx]['predicate'] = predicate
      const subjects = Object.keys(triples[object][predicate])
      subjects.forEach(
        subject => (dehydratedTriples[objectIdx]['subject'] = subject)
      )
    })
  })

  return dehydratedTriples
}
