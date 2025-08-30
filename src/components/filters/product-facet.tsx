type ProductFacetProps = {
  id: string;
  className?: string;
  isCheckedAction: (value: string) => boolean;
  onCheckedChangeAction: (value: string) => void;
};

export default function ProductFacet({ id, className, onCheckedChangeAction, isCheckedAction }: CategoryFacetProps) {
  return (
    <div>
      Enter
    </div>
  );
}

function ProductFacetContent({ onCheckedChangeAction, isCheckedAction }: Omit<ProductFacetProps, 'id'>) {

}
