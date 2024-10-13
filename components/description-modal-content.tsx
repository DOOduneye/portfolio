import {Dispatch, SetStateAction} from 'react';

import {DialogCheckbox, DialogInput, DialogTextArea} from '@/components/dialog';
import {Description, DescriptionWithoutId} from '@/types/description';

interface DescriptionModalContentProps<
  T extends Description | DescriptionWithoutId,
> {
  description: T;
  setDescription: Dispatch<SetStateAction<T>>;
}

export function DescriptionModalContent<
  T extends Description | DescriptionWithoutId,
>({description, setDescription}: DescriptionModalContentProps<T>) {
  return (
    <div className="grid gap-4 py-4">
      <DialogInput
        title="Title"
        label="title"
        value={description?.title}
        onChange={e => setDescription({...description, title: e.target.value})}
      />
      <DialogTextArea
        title="Description"
        label="description"
        value={description?.description}
        onChange={e =>
          setDescription({...description, description: e.target.value})
        }
      />
    </div>
  );
}
