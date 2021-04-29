export default function StepHead(props) {
  const { title } = props;
  return (
    <div className="flex items-center justify-center p-8">
      <p className="text-2xl font-bold">{title}</p>
    </div>
  );
}
