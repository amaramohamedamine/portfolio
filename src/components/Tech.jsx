/* eslint-disable react/prop-types */
import TechBowling from './canvas/TechBowling'
import { technologies } from '../constants/data'
import { SectionWrapper } from '../hoc'

function Tech() {
  return (
    <div className='w-full'>
      <TechBowling items={technologies} />
    </div>
  )
}

const WrappedTech = SectionWrapper(Tech,"");
export default WrappedTech;