import FacetsContent from './facets-content';

type FacetsDesktopProps = {
  className?: string;
};

export default function FacetsDesktop({ className }: FacetsDesktopProps) {
  return (
    <FacetsContent className={className} />
  );
}
