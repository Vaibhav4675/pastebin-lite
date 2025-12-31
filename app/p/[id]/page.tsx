import PasteClient from "./PasteClient";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PasteClient id={id} />;
}
