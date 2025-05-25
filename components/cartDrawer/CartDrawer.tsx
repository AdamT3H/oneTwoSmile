import styles from "./CartDrawer.module.css";
import CartDrawerContext from "./CartDrawerContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  return (
    <div className={styles.container}>
      <CartDrawerContext isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
