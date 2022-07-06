import cn from "classnames";
import styles from "./CopiedAlert.module.css";

const CopiedAlert = ({ visible }) => {
  return (
    <div
      className={cn(
        styles.copiedAlert,
        visible && styles.visible,
        "text-size-xs"
      )}
    >
      🔗 Copied to clipboard.
    </div>
  );
};

export default CopiedAlert;
