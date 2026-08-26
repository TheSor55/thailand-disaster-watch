/**
 * Preview badge — displayed prominently on development-only UI pages.
 * Must NOT be hideable by the user in normal UI flow.
 */

interface PreviewBadgeProps {
  compact?: boolean;
}

export function PreviewBadge({ compact = false }: PreviewBadgeProps) {
  if (compact) {
    return (
      <span className="preview-badge preview-badge--compact" aria-label="Development Preview — Not Operational">
        DEV PREVIEW
      </span>
    );
  }
  return (
    <div className="preview-badge-banner" role="status" aria-label="Development Preview — Not Operational">
      <strong>⚠ DEVELOPMENT PREVIEW</strong>
      <span>NOT OPERATIONAL — ระบบนี้ยังไม่ใช่ระบบเตือนภัยทางการ ข้อมูลนี้ไม่ใช่การเตือนภัยอย่างเป็นทางการ</span>
    </div>
  );
}
