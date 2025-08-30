// TODO: FacetsMobile is modal dialog based on FacetsContent

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '../icons';
import FacetsContent from './facets-content';

export default function FacetsMobile() {
  return (
    <Dialog>
      <DialogTrigger
        className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
      >
        <Icons.funnel aria-hidden="true" className="size-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <FacetsContent />
      </DialogContent>
    </Dialog>
  );
}
