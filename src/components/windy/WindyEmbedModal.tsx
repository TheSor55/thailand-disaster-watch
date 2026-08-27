import { WindyView } from './WindyView';

interface WindyEmbedModalProps {
  lat?: number;
  lon?: number;
  zoom?: number;
  locationName?: string;
  onClose: () => void;
}

export function WindyEmbedModal({
  lat = 13.7563,
  lon = 100.5018,
  zoom = 7,
  locationName = 'ประเทศไทย',
  onClose,
}: WindyEmbedModalProps) {
  return (
    <div className="windy-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="windy-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="windy-modal-header">
          <div>
            <span className="eyebrow">WINDY.COM OVERLAY</span>
            <h3>🌀 แผนที่ลมและพายุ: {locationName}</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close Windy Modal">
            ✕
          </button>
        </div>

        <div className="windy-modal-body">
          <WindyView lat={lat} lon={lon} zoom={zoom} locationName={locationName} />
        </div>
      </div>
    </div>
  );
}
