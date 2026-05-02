interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="h-14 flex items-center px-6 bg-white border-b border-gray-100">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </div>
  );
}
