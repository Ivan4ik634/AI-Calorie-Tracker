'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface EditFieldDialogProps {
  open: boolean;
  title: string;
  label: string;
  value: number | string;
  type?: 'text' | 'number';
  suffix?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (value: string) => void;
}

export function EditFieldDialog({
  open,
  title,
  label,
  value,
  type = 'text',
  suffix,
  onOpenChange,
  onSave,
}: EditFieldDialogProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    if (open) setDraft(String(value));
  }, [open, value]);

  const handleSave = () => {
    if (draft.trim() === '') return;
    onSave(draft.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{title}</DialogTitle>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{label}</label>
            <div className="flex items-center gap-2">
              <Input
                autoFocus
                type={type}
                inputMode={type === 'number' ? 'numeric' : 'text'}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSave()}
                className="h-11 rounded-xl text-base"
              />
              {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-xl">
              Скасувати
            </Button>
            <Button type="button" onClick={handleSave} className="h-11 flex-1 rounded-xl">
              Зберегти
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
