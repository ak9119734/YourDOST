import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, PhoneCall, MessageSquare, Video, Mic } from 'lucide-react';
import type { BookingConfirmation, CounselorProfile } from '../types';
import { COUNSELORS } from '../data/wellbeingCatalog';

interface CounselorBookingDrawerProps {
  isOpen: boolean;
  initialCounselorId?: string;
  priorityCallbackMode?: boolean;
  onClose: () => void;
}

export const CounselorBookingDrawer: React.FC<CounselorBookingDrawerProps> = ({
  isOpen,
  initialCounselorId,
  priorityCallbackMode = false,
  onClose,
}) => {
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>(
    initialCounselorId || COUNSELORS[0].id
  );
  const [format, setFormat] = useState<'Chat' | 'Audio' | 'Video'>(
    priorityCallbackMode ? 'Audio' : 'Chat'
  );
  const [slot, setSlot] = useState<string>('');
  const [alias, setAlias] = useState<string>('');
  const [isPriority, setIsPriority] = useState<boolean>(priorityCallbackMode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [imgErrorIds, setImgErrorIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const nextId =
        initialCounselorId && COUNSELORS.some((c) => c.id === initialCounselorId)
          ? initialCounselorId
          : COUNSELORS[0].id;
      setSelectedCounselorId(nextId);
      const found = COUNSELORS.find((c) => c.id === nextId) || COUNSELORS[0];
      setSlot(found.availableSlots[0]);
      setIsPriority(priorityCallbackMode);
      setFormat(priorityCallbackMode ? 'Audio' : 'Chat');
      setConfirmation(null);
      setErrorMsg(null);
    }
  }, [isOpen, initialCounselorId, priorityCallbackMode]);

  if (!isOpen) return null;

  const counselor: CounselorProfile =
    COUNSELORS.find((c) => c.id === selectedCounselorId) || COUNSELORS[0];

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counselorId: counselor.id,
          format,
          slot: slot || counselor.nextAvailable,
          alias: alias.trim() || 'Anonymous Employee',
          priorityCallback: isPriority,
        }),
      });
      const raw = await res.text();
      let data: BookingConfirmation;
      try {
        data = JSON.parse(raw) as BookingConfirmation;
      } catch {
        throw new Error('Could not confirm booking slot.');
      }
      if (!res.ok) {
        throw new Error('Could not confirm booking slot.');
      }
      setConfirmation(data);
    } catch {
      setErrorMsg('Unable to reserve this slot right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1C2421]/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-drawer-title"
    >
      <div className="flex h-full w-full max-w-lg flex-col border-l border-[#E5E4DF] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E4DF] px-6 py-4">
          <div>
            <p className="text-xs font-medium text-[#575A56]">
              Confidential 1-on-1 Care · Zero HR visibility
            </p>
            <h2 id="booking-drawer-title" className="text-lg font-semibold text-[#1C2421]">
              {isPriority ? 'Request Priority Human Support' : 'Book a Counselor Session'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking panel"
            className="rounded-lg p-2 text-[#575A56] hover:bg-[#F8F7F4] hover:text-[#1C2421] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {confirmation ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#D1E3DD] bg-[#F2F7F5] p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#1F6E5D]" />
                  <div>
                    <p className="text-xs font-mono font-medium text-[#1F6E5D]">
                      Reference {confirmation.referenceId}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-[#1C2421]">
                      {confirmation.priorityCallback
                        ? 'Priority counselor callback requested'
                        : 'Session slot reserved'}
                    </h3>
                    <p className="mt-2 text-sm text-[#575A56]">
                      {confirmation.counselorName} will connect via {confirmation.format} for{' '}
                      <span className="font-medium text-[#1C2421]">{confirmation.slot}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-[#E5E4DF] pt-5 text-sm text-[#575A56]">
                <div className="flex justify-between">
                  <span>Display name in session</span>
                  <span className="font-medium text-[#1C2421]">{confirmation.alias}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session privacy</span>
                  <span className="font-medium text-[#1C2421]">Encrypted · Not reported</span>
                </div>
                <div className="flex justify-between">
                  <span>Synthetic prototype notice</span>
                  <span className="font-mono text-xs text-[#575A56]">Demo confirmation</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg bg-[#1F6E5D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#18584A] cursor-pointer"
              >
                Return to Care Navigator
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-6">
              {isPriority && (
                <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#7F1D1D]">
                  <div className="flex items-start gap-3">
                    <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C]" />
                    <p>
                      Priority queue connects you to the first available specialist within 15
                      minutes—no intake quiz required.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#575A56] mb-2">
                  Select Specialist
                </label>
                <div className="space-y-2.5">
                  {COUNSELORS.map((c) => {
                    const selected = c.id === counselor.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCounselorId(c.id);
                          setSlot(c.availableSlots[0]);
                        }}
                        className={`flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#1F6E5D] bg-[#F2F7F5]'
                            : 'border-[#E5E4DF] bg-white hover:bg-[#F8F7F4]'
                        }`}
                      >
                        {!imgErrorIds[c.id] ? (
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            referrerPolicy="no-referrer"
                            onError={() => setImgErrorIds((prev) => ({ ...prev, [c.id]: true }))}
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E6EFEA] font-display text-sm font-semibold text-[#1F6E5D]">
                            {c.name
                              .split(' ')
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-[#1C2421] truncate">{c.name}</p>
                            <span className="text-xs font-mono text-[#1F6E5D] whitespace-nowrap shrink-0">
                              {c.nextAvailable}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-[#575A56]">{c.credentials}</p>
                          <p className="mt-1 text-xs text-[#575A56]">
                            {c.specialties.join(' · ')}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575A56] mb-2">
                  Preferred Session Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Chat', 'Audio', 'Video'] as const).map((item) => {
                    const active = format === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFormat(item)}
                        className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#1F6E5D] bg-[#1F6E5D] text-white'
                            : 'border-[#E5E4DF] bg-white text-[#1C2421] hover:bg-[#F8F7F4]'
                        }`}
                      >
                        {item === 'Chat' && <MessageSquare className="h-4 w-4" />}
                        {item === 'Audio' && <Mic className="h-4 w-4" />}
                        {item === 'Video' && <Video className="h-4 w-4" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isPriority && (
                <div>
                  <label className="block text-xs font-medium text-[#575A56] mb-2">
                    Available Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {counselor.availableSlots.map((s) => {
                      const active = slot === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSlot(s)}
                          className={`rounded-lg border px-3 py-2 text-left text-xs font-mono transition-colors cursor-pointer ${
                            active
                              ? 'border-[#1F6E5D] bg-[#F2F7F5] font-medium text-[#1F6E5D]'
                              : 'border-[#E5E4DF] bg-white text-[#1C2421] hover:bg-[#F8F7F4]'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="session-alias" className="block text-xs font-medium text-[#575A56] mb-1.5">
                  Preferred First Name or Anonymous Alias (optional)
                </label>
                <input
                  id="session-alias"
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g., Sam (or leave blank for Anonymous)"
                  className="w-full rounded-lg border border-[#E5E4DF] bg-white px-3.5 py-2.5 text-sm text-[#1C2421] placeholder:text-[#8A8E88]"
                />
              </div>

              <div className="flex items-start gap-2.5 rounded-lg bg-[#F8F7F4] p-3 text-xs text-[#575A56]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1F6E5D]" />
                <p>
                  Your employer receives only aggregate utilization counts—never session topics,
                  counselor notes, or individual booking names.
                </p>
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-[#B91C1C]" role="alert">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-[#E5E4DF] bg-white px-4 py-2.5 text-sm font-medium text-[#1C2421] hover:bg-[#F8F7F4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#1F6E5D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#18584A] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting
                    ? 'Confirming...'
                    : isPriority
                    ? 'Request Priority Callback'
                    : 'Confirm Confidential Slot'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
