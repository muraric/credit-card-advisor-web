"use client";

export default function StoreInput({
                                       store,
                                       setStore,
                                       onSubmit
                                   }: {
    store: string;
    setStore: (s: string) => void;
    onSubmit: (store: string) => void;
}) {
    return (
        <div className="flex gap-2">
            <input
                className="flex-1 border p-2 rounded"
                placeholder="Enter store name"
                value={store}
                onChange={(e) => setStore(e.target.value)}
            />
            <button
                onClick={() => {
                    if (store.trim()) onSubmit(store);
                }}
                className="px-4 bg-blue-600 text-white rounded"
            >
                Search
            </button>
        </div>
    );
}
