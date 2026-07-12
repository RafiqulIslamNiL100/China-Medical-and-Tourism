import type { Metadata } from "next";
import { Button } from "@/components/Button";

export const metadata: Metadata = { title: "Airport Transfers" };

export default function TransfersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Airport Transfers</h1>
      <p className="text-sm text-neutral-500">
        Request a pickup or drop-off and your case manager will assign a driver.
      </p>

      <form className="flex max-w-lg flex-col gap-4 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="direction" className="text-sm font-semibold text-neutral-900">
            Direction
          </label>
          <select
            id="direction"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          >
            <option>Airport Arrival</option>
            <option>Airport Departure</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="flight" className="text-sm font-semibold text-neutral-900">
              Flight number
            </label>
            <input
              id="flight"
              type="text"
              placeholder="e.g. CA987"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="datetime" className="text-sm font-semibold text-neutral-900">
              Date &amp; time
            </label>
            <input
              id="datetime"
              type="datetime-local"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dropoff" className="text-sm font-semibold text-neutral-900">
            Drop-off location
          </label>
          <input
            id="dropoff"
            type="text"
            placeholder="Hotel name or hospital"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          />
        </div>
        <Button type="submit" className="w-fit">
          Request Transfer
        </Button>
        <p className="text-xs text-neutral-500">
          A driver is typically assigned within 48 hours of your scheduled service.
        </p>
      </form>
    </div>
  );
}
