import { useState } from 'react';

export function useModal(defVal = false) {
    const [isOpen, setIsOpen] = useState(defVal);
    return [isOpen, () => setIsOpen(true), () => setIsOpen(false)]

}