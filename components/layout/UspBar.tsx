export default function UspBar() {
  const items = [
    'Minimal 12 Months Warranty',
    '14 Day Return',
    'Checked By Professionals',
    '4.9 Customer Rating',
  ];

  return (
    <div className="bg-[#1E2133] text-white text-xs font-medium tracking-wide py-2.5">
      <div className="container">
        <div className="flex justify-center gap-8 overflow-x-auto scrollbar-hide">
          {items.map(item => (
            <div key={item} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8692A] shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
