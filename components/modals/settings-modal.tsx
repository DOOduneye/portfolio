'use client';

import {useSettings} from '@/hooks/use-settings';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {ModeToggle} from '@/components/mode-toggle';

export const SettingsModal = () => {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex item-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <DialogDescription>Customize how the site looks.</DialogDescription>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
