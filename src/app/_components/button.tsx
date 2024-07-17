export default function Button({
  value,
  loading,
}: {
  value: string;
  loading: boolean;
}) {
  return (
    <>
      <button
        className="w-100 flex cursor-pointer items-center justify-center rounded-md bg-black p-2 text-white"
        disabled={loading}
      >
        {!loading ? (
          <>{value}</>
        ) : (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-l-0 border-t-0 border-solid border-white"></div>
        )}
      </button>
    </>
  );
}
