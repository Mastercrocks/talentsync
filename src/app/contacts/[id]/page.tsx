// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ContactDetails(props: any) {
  const id: string | undefined = props?.params?.id;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contact Details</h1>
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="text-sm">ID: {id}</div>
        <div className="text-sm text-muted-foreground">Engagement history, tags, notes (placeholder)</div>
      </div>
    </div>
  );
}
