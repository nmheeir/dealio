import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '../ui/button';

const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
];

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
];

// TODO: Fetch data from api

export default function FacetsContent() {
  return (
    <div>
      <form className="hidden lg:block">
        {/* Brand */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger
              className="group flex w-full items-center justify-between bg-white hover:no-underline"
            >
              Brand
            </AccordionTrigger>
            <AccordionContent>
              <Button variant="outline" className="rounded-full">
                Steam
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={['item-1']}
        >
          {filters.map(section => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b border-gray-200 py-6"
            >
              <AccordionTrigger
                className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
              >
                {section.name}
              </AccordionTrigger>
              <AccordionContent
                className="space-y-4 pt-6"
              >
                {section.options.map((option, optionIdx) => (
                  <div key={option.value} className="flex gap-3">
                    <div className="flex h-5 shrink-0 items-center">
                      <div className="group grid size-4 grid-cols-1">
                        <input
                          defaultValue={option.value}
                          defaultChecked={option.checked}
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          type="checkbox"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 14 14"
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 place-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                          />
                          <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                          />
                        </svg>
                      </div>
                    </div>
                    <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                      {option.label}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </form>
    </div>
  );
}
